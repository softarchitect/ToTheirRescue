from datetime import datetime
from uuid import uuid4
import os

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import ArtifactAttachment, Animal, User, User


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


def _attachment_to_dict(attachment: ArtifactAttachment) -> dict:
    """Convert ArtifactAttachment model to dictionary format matching old API response."""
    return {
        "id": attachment.id,
        "entity": attachment.entity or "",
        "attachmentType": attachment.attachment_type or "",
        "fileName": attachment.file_name or "",
        "fileNameExtension": attachment.file_name_extension or "",
        "attachmentDate": (attachment.attachment_date or datetime.utcnow()).isoformat() if attachment.attachment_date else None,
        "publicityRank": attachment.publicity_rank or 0,
        "sequenceNo": attachment.sequence_no or 0,
        "notes": attachment.notes or "",
        "originalBlobUrl": attachment.original_blob_url or "",
        "blobUrl": attachment.blob_url or "",
        "thumbnailBlobUrl": attachment.thumbnail_blob_url or "",
        "dateEntered": (attachment.date_entered or datetime.utcnow()).isoformat() if attachment.date_entered else None,
        "dateModified": attachment.date_modified.isoformat() if attachment.date_modified else None,
        "enteredBy": attachment.entered_by or "",
        "modifiedBy": attachment.modified_by or "",
        "isDeleted": attachment.is_deleted or False,
        "pcoId": attachment.pco_id,
        "animalId": attachment.animal_id,
        "tenantId": attachment.tenant_id or 0,
        "animal": attachment.animal or "",
        "description": attachment.description or "",
        "person": attachment.person or "",
        "originalFileName": attachment.original_file_name or "",
    }


@artifact_attachments_bp.get("/get-artifactattachment-tenant/<int:tenant_id>")
def get_artifact_by_tenant(tenant_id: int):
    """Get all attachments for a tenant, optionally filtered by isDeleted."""
    if tenant_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Tenant identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    is_deleted = request.args.get("isDeleted", "false").lower() == "true"

    try:
        attachments = (
            ArtifactAttachment.query.filter(
                ArtifactAttachment.tenant_id == tenant_id,
                ArtifactAttachment.is_deleted.is_(is_deleted),
            )
            .order_by(ArtifactAttachment.publicity_rank)
            .all()
        )

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachments retrieved successfully",
                "data": {
                    "artifactAttachments": [_attachment_to_dict(a) for a in attachments]
                },
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [f"Oops! Something wrong getting attachments: {str(e)}"],
                "statusCode": 400,
            }
        ), 400


@artifact_attachments_bp.get("/get-artifactattachment-id/<int:attachment_id>")
def get_artifact_by_id(attachment_id: int):
    """Get a single attachment by ID, optionally filtered by isDeleted and tenantId."""
    tenant_id = request.args.get("tenantId", type=int)
    is_deleted = request.args.get("isDeleted", "false").lower() == "true"

    if tenant_id and tenant_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Tenant identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    if attachment_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Attachment identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    try:
        query = ArtifactAttachment.query.filter(
            ArtifactAttachment.id == attachment_id,
            ArtifactAttachment.is_deleted.is_(is_deleted),
        )

        if tenant_id:
            query = query.filter(ArtifactAttachment.tenant_id == tenant_id)

        attachment = query.first()

        if not attachment:
            return jsonify(
                {
                    "success": False,
                    "errors": ["Attachment not found"],
                    "statusCode": 404,
                }
            ), 404

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachment retrieved successfully",
                "data": {"artifactAttachment": _attachment_to_dict(attachment)},
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [f"Oops! Something wrong getting attachment: {str(e)}"],
                "statusCode": 400,
            }
        ), 400


@artifact_attachments_bp.get("/get-artifactattachment-byanimal/<int:animal_id>")
def get_artifact_by_animal_id(animal_id: int):
    """Get a single attachment for an animal (first by publicity rank)."""
    if animal_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Animal identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    try:
        attachments = (
            ArtifactAttachment.query.filter(
                ArtifactAttachment.animal_id == animal_id,
                ArtifactAttachment.is_deleted.is_(False),
            )
            .order_by(ArtifactAttachment.publicity_rank)
            .all()
        )

        attachment = attachments[0] if attachments else None

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachment retrieved successfully",
                "data": {
                    "artifactAttachment": _attachment_to_dict(attachment)
                    if attachment
                    else None
                },
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [f"Oops! Something wrong getting attachment: {str(e)}"],
                "statusCode": 400,
            }
        ), 400


@artifact_attachments_bp.get("/get-artifactattachment-bypco/<int:pco_id>")
def get_artifact_by_pco_id(pco_id: int):
    """Get a single attachment for a PCO (first by publicity rank)."""
    if pco_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["PCO identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    try:
        attachments = (
            ArtifactAttachment.query.filter(
                ArtifactAttachment.pco_id == pco_id,
                ArtifactAttachment.is_deleted.is_(False),
            )
            .order_by(ArtifactAttachment.publicity_rank)
            .all()
        )

        attachment = attachments[0] if attachments else None

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachment retrieved successfully",
                "data": {
                    "artifactAttachment": _attachment_to_dict(attachment)
                    if attachment
                    else None
                },
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [f"Oops! Something wrong getting attachment: {str(e)}"],
                "statusCode": 400,
            }
        ), 400


@artifact_attachments_bp.get("/get-allartifact-by-animalid/<int:animal_id>")
def get_all_artifact_by_animal_id(animal_id: int):
    """Get all attachments for an animal, filtered by tenantId."""
    tenant_id = request.args.get("tenantId", type=int)

    if tenant_id and tenant_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Tenant identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    if animal_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Animal identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    try:
        query = ArtifactAttachment.query.filter(
            ArtifactAttachment.animal_id == animal_id,
            ArtifactAttachment.entity == "Animal",
            ArtifactAttachment.is_deleted.is_(False),
        )

        if tenant_id:
            query = query.filter(ArtifactAttachment.tenant_id == tenant_id)

        attachments = query.order_by(ArtifactAttachment.publicity_rank).all()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachments retrieved successfully",
                "data": {
                    "artifactAttachments": [_attachment_to_dict(a) for a in attachments]
                },
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [
                    f"Oops! Something wrong getting attachment list: {str(e)}"
                ],
                "statusCode": 400,
            }
        ), 400


@artifact_attachments_bp.get("/get-allartifact-by-pcoid/<int:pco_id>")
def get_all_artifact_by_pco_id(pco_id: int):
    """Get all attachments for a PCO, filtered by tenantId."""
    tenant_id = request.args.get("tenantId", type=int)

    if tenant_id and tenant_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Tenant identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    if pco_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["PCO identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    try:
        query = ArtifactAttachment.query.filter(
            ArtifactAttachment.pco_id == pco_id,
            ArtifactAttachment.entity == "PCO",
            ArtifactAttachment.is_deleted.is_(False),
        )

        if tenant_id:
            query = query.filter(ArtifactAttachment.tenant_id == tenant_id)

        attachments = query.order_by(ArtifactAttachment.publicity_rank).all()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachments retrieved successfully",
                "data": {
                    "artifactAttachments": [_attachment_to_dict(a) for a in attachments]
                },
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [
                    f"Oops! Something wrong getting attachment list: {str(e)}"
                ],
                "statusCode": 400,
            }
        ), 400


@artifact_attachments_bp.get("/get-allartifact-by-tenantid/<int:tenant_id>")
def get_all_artifact_by_tenant_id(tenant_id: int):
    """Get all attachments for a tenant."""
    if tenant_id <= 0:
        return jsonify(
            {
                "success": False,
                "errors": ["Tenant identifier must be greater than 0"],
                "statusCode": 200,
            }
        ), 200

    try:
        attachments = (
            ArtifactAttachment.query.filter(
                ArtifactAttachment.tenant_id == tenant_id,
                ArtifactAttachment.entity == "TENANT",
                ArtifactAttachment.is_deleted.is_(False),
            )
            .order_by(ArtifactAttachment.publicity_rank)
            .all()
        )

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Attachments retrieved successfully",
                "data": {
                    "artifactAttachments": [_attachment_to_dict(a) for a in attachments]
                },
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "errors": [
                    f"Oops! Something wrong getting attachment list: {str(e)}"
                ],
                "statusCode": 400,
            }
        ), 400


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "")


@artifact_attachments_bp.post("/create-artifactattachment")
@jwt_required()
def create_artifact_attachment():
    """Create a new artifact attachment for tenant, animal, or PCO.
    
    This endpoint accepts multipart/form-data and handles file uploads.
    Based on the old system's create-artifactattachment endpoint.
    """
    # Get tenant_id and username from JWT
    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    # Get form data
    entity = (request.form.get("entity") or request.form.get("Entity") or "").strip().upper()
    attachment_type_raw = (request.form.get("attachmentType") or request.form.get("AttachmentType") or "").strip()
    tenant_id_form = request.form.get("tenantId")
    animal_id = request.form.get("animalId")
    pco_id = request.form.get("pcoId")
    attachment_date_raw = request.form.get("attachmentDate")
    publicity_rank_raw = request.form.get("publicityRank") or request.form.get("PublicityRank") or "0"
    description = (request.form.get("description") or request.form.get("Description") or "").strip()
    notes = (request.form.get("notes") or request.form.get("Notes") or "").strip()
    
    # Get file - check both possible field names
    file = request.files.get("file") or request.files.get("Imagefiles")
    
    if not file or file.filename == "":
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["File is required"]
        }), 400
    
    # Determine entity type - if not provided, infer from other fields
    if entity not in ["TENANT", "ANIMAL", "PCO"]:
        if animal_id:
            entity = "ANIMAL"
        elif pco_id:
            entity = "PCO"
        else:
            entity = "TENANT"  # Default to tenant when only tenantId is provided
    
    # Normalize attachment type
    attachment_type_lower = attachment_type_raw.lower()
    if "photo" in attachment_type_lower:
        attachment_type = "PHOTO"
    elif "video" in attachment_type_lower:
        attachment_type = "VIDEO"
    else:
        attachment_type = "DOCUMENT"
    
    # Use tenant_id from form if provided, otherwise from JWT
    tenant_id_to_use = int(tenant_id_form) if tenant_id_form else tenant_id
    
    # Get sequence number - find the last sequence for this tenant/entity/type
    try:
        last_attachment = (
            ArtifactAttachment.query.filter(
                ArtifactAttachment.tenant_id == tenant_id_to_use,
                ArtifactAttachment.entity == entity,
                ArtifactAttachment.attachment_type == attachment_type,
                ArtifactAttachment.is_deleted.is_(False),
            )
            .order_by(ArtifactAttachment.sequence_no.desc())
            .first()
        )
        sequence_no = (last_attachment.sequence_no + 1) if last_attachment else 1
    except Exception as e:
        sequence_no = 1
    
    # Parse attachment date
    try:
        if attachment_date_raw:
            attachment_date = datetime.fromisoformat(attachment_date_raw.replace("Z", "+00:00"))
        else:
            attachment_date = datetime.utcnow()
    except ValueError:
        attachment_date = datetime.utcnow()
    
    # Parse publicity rank
    try:
        publicity_rank = int(publicity_rank_raw) if publicity_rank_raw else 0
    except (TypeError, ValueError):
        publicity_rank = 0
    
    # Generate filename
    original_name = file.filename or "attachment"
    ext = "." + (original_name.rsplit(".", 1)[-1] if "." in original_name else "jpg")
    ext = ext.lower()
    
    # Create uploads directory
    uploads_root = current_app.static_folder or "static"
    uploads_dir = os.path.join(uploads_root, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate unique filename
    file_stub = uuid4().hex
    file_name = f"{file_stub}{ext}"
    file_path = os.path.join(uploads_dir, file_name)
    
    # Save file
    file.save(file_path)
    
    # URL path for the file
    url_path = f"/static/uploads/{file_name}"
    
    # Set entity-specific fields
    animal_id_val = int(animal_id) if animal_id and entity == "ANIMAL" else None
    pco_id_val = int(pco_id) if pco_id and entity == "PCO" else (0 if entity == "TENANT" else None)
    animal_name = ""
    person_name = ""
    
    if entity == "ANIMAL" and animal_id_val:
        animal = Animal.query.get(animal_id_val)
        if animal:
            animal_name = animal.animal_name or ""
    
    # Create attachment record
    attachment = ArtifactAttachment(
        entity=entity,
        attachment_type=attachment_type,
        file_name=file_name,
        file_name_extension=ext,
        attachment_date=attachment_date,
        publicity_rank=publicity_rank,
        sequence_no=sequence_no,
        notes=notes,
        original_blob_url=url_path,
        blob_url=url_path,
        thumbnail_blob_url=url_path,
        date_entered=datetime.utcnow(),
        entered_by=username or "system",
        is_deleted=False,
        pco_id=pco_id_val,
        animal_id=animal_id_val,
        tenant_id=tenant_id_to_use,
        animal=animal_name,
        description=description,
        person=person_name,
        original_file_name=original_name,
    )
    
    db.session.add(attachment)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "statusCode": 200,
        "message": "Attachment created successfully",
        "data": {
            "artifactAttachment": _attachment_to_dict(attachment)
        }
    }), 200


@artifact_attachments_bp.patch("/delete-artifactattachment/<int:attachment_id>")
@jwt_required()
def delete_artifact_attachment(attachment_id):
    """Port of the old api/artifact-attachment/delete-artifactattachment/{id} endpoint.
    
    Soft deletes an artifact attachment by setting is_deleted to True.
    """
    if attachment_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 200,
            "errors": ["Artifact identifier must be greater than 0"]
        }), 200
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        attachment = ArtifactAttachment.query.get(attachment_id)
        
        if not attachment:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["Attachment not found"]
            }), 404
        
        # Check if it belongs to the tenant
        if tenant_id and attachment.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        # Soft delete the attachment
        attachment.is_deleted = True
        attachment.modified_by = username
        attachment.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Attachment deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting attachment: {str(e)}"]
        }), 400

