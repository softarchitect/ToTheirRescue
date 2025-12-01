from datetime import datetime
from uuid import uuid4

from flask import Blueprint, jsonify, request

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



