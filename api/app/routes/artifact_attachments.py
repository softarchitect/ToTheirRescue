from datetime import datetime
from uuid import uuid4
import os

from flask import Blueprint, jsonify, request, current_app

from ..extensions import db
from ..models import ArtifactAttachment, Animal


artifact_attachments_bp = Blueprint("artifact_attachments", __name__)


@artifact_attachments_bp.get("/by-animal/<int:animal_id>")
def get_media_by_animal(animal_id: int):
    """Return all non-deleted media attachments for a single animal."""
    if animal_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal identifier must be greater than 0"],
                }
            ),
            400,
        )

    items = (
        ArtifactAttachment.query.filter(
            ArtifactAttachment.animal_id == animal_id,
            ArtifactAttachment.is_deleted.is_(False),
        )
        .order_by(ArtifactAttachment.attachment_date.desc())
        .all()
    )

    def _frontend_type(a: ArtifactAttachment) -> str:
        t = (a.attachment_type or "").lower()
        if "photo" in t:
            return "photo"
        if "video" in t:
            return "video"
        return "document"

    media = [
        {
            "id": str(a.id),
            "type": _frontend_type(a),
            "url": a.blob_url or "/placeholder.svg?height=200&width=300",
            "date": (a.attachment_date or a.date_entered or datetime.utcnow())
            .date()
            .isoformat(),
            "rank": a.publicity_rank or 0,
            "description": a.description or a.file_name or "",
            "notes": a.notes or "",
        }
        for a in items
    ]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Media retrieved successfully",
            "data": {"media": media},
        }
    )


@artifact_attachments_bp.post("/create-for-animal")
def create_media_for_animal():
    """Create a new media record for an animal.

    This is a greatly simplified version of the old artifact upload logic.
    We persist metadata in the PVDs table and, for now, use a placeholder URL
    instead of storing the actual binary.
    """
    payload = request.get_json(silent=True) or {}
    animal_id = payload.get("animalId")
    media_type = (payload.get("type") or "").strip().lower()
    date_raw = (payload.get("date") or "").strip()
    description = (payload.get("description") or "").strip()
    notes = (payload.get("notes") or "").strip()
    rank = payload.get("rank") or 0

    if not animal_id or not media_type or not date_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalId, type, and date are required."],
                }
            ),
            400,
        )

    try:
        animal_id_int = int(animal_id)
    except (TypeError, ValueError):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalId must be an integer."],
                }
            ),
            400,
        )

    animal = Animal.query.get(animal_id_int)
    if not animal:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Animal not found."],
                }
            ),
            404,
        )

    try:
        attachment_date = datetime.fromisoformat(date_raw)
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid attachment date."],
                }
            ),
            400,
        )

    # Map frontend type to legacy attachment type.
    if media_type == "photo":
        attachment_type = "PHOTO"
        extension = ".jpg"
    elif media_type == "video":
        attachment_type = "VIDEO"
        extension = ".mp4"
    else:
        attachment_type = "DOCUMENT"
        extension = ".pdf"

    file_stub = f"virtual-{uuid4().hex}"
    file_name = f"{file_stub}{extension}"

    media = ArtifactAttachment(
        entity="ANIMAL",
        attachment_type=attachment_type,
        file_name=file_name,
        file_name_extension=extension,
        attachment_date=attachment_date,
        publicity_rank=int(rank) if isinstance(rank, int) or str(rank).isdigit() else 0,
        sequence_no=0,
        notes=notes,
        original_blob_url="/placeholder.svg?height=200&width=300",
        blob_url="/placeholder.svg?height=200&width=300",
        thumbnail_blob_url="/placeholder.svg?height=200&width=300",
        date_entered=datetime.utcnow(),
        entered_by="system",
        is_deleted=False,
        pco_id=None,
        animal_id=animal.id,
        tenant_id=animal.tenant_id or 0,
        animal=animal.animal_name or "",
        description=description or "",
        person=None,
        original_file_name=file_name,
    )


@artifact_attachments_bp.post("/upload-image")
def upload_image_for_animal():
    """Upload a single image file for an animal and create an attachment row.

    This mirrors the old uploadImageCall behaviour in a simplified way:
    - Accepts multipart/form-data with a single file field named ``file``.
    - animalId is required and must reference an existing Animal.

    The binary is stored under the Flask ``static/uploads`` directory so it can
    be served directly by the API, and the resulting URL is stored in the
    ArtifactAttachment blob url fields.
    """

    # Validate animal id
    animal_id_raw = request.form.get("animalId")
    if not animal_id_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalId is required."],
                }
            ),
            400,
        )

    try:
        animal_id = int(animal_id_raw)
    except (TypeError, ValueError):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalId must be an integer."],
                }
            ),
            400,
        )

    animal = Animal.query.get(animal_id)
    if not animal:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Animal not found."],
                }
            ),
            404,
        )

    file = request.files.get("file")
    if not file or file.filename == "":
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["An image file is required."],
                }
            ),
            400,
        )

    # Attachment metadata
    attachment_date_raw = request.form.get("attachmentDate") or datetime.utcnow().isoformat()
    try:
        attachment_date = datetime.fromisoformat(attachment_date_raw)
    except ValueError:
        attachment_date = datetime.utcnow()

    publicity_rank_raw = request.form.get("publicityRank") or "0"
    try:
        publicity_rank = int(publicity_rank_raw)
    except (TypeError, ValueError):
        publicity_rank = 0

    notes = (request.form.get("notes") or "").strip()
    description = (request.form.get("description") or "").strip()

    # Derive a safe filename under static/uploads
    original_name = file.filename or "animal-photo.jpg"
    ext = "." + (original_name.rsplit(".", 1)[-1] or "jpg")
    ext = ext.lower()

    uploads_root = current_app.static_folder or "static"
    uploads_dir = os.path.join(uploads_root, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    file_stub = uuid4().hex
    file_name = f"{file_stub}{ext}"
    file_path = os.path.join(uploads_dir, file_name)

    file.save(file_path)

    # URL the frontend can use to load the image
    url_path = f"/static/uploads/{file_name}"

    media = ArtifactAttachment(
        entity="ANIMAL",
        attachment_type="PHOTO",
        file_name=file_name,
        file_name_extension=ext,
        attachment_date=attachment_date,
        publicity_rank=publicity_rank,
        sequence_no=0,
        notes=notes,
        original_blob_url=url_path,
        blob_url=url_path,
        thumbnail_blob_url=url_path,
        date_entered=datetime.utcnow(),
        entered_by="system",
        is_deleted=False,
        pco_id=None,
        animal_id=animal.id,
        tenant_id=animal.tenant_id or 0,
        animal=animal.animal_name or "",
        description=description or "",
        person=None,
        original_file_name=original_name,
    )

    db.session.add(media)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Image uploaded successfully",
            "data": {
                "id": str(media.id),
                "type": "photo",
                "url": url_path,
                "date": attachment_date.date().isoformat(),
                "rank": media.publicity_rank or 0,
                "description": media.description or "",
                "notes": media.notes or "",
            },
        }
    )

    db.session.add(media)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Media added successfully",
            "data": {
                "id": str(media.id),
                "type": media_type,
                "url": media.blob_url,
                "date": attachment_date.date().isoformat(),
                "rank": media.publicity_rank or 0,
                "description": media.description or "",
                "notes": media.notes or "",
            },
        }
    )



