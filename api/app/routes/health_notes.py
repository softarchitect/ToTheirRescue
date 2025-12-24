from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, HealthNote, User


health_notes_bp = Blueprint("health_notes", __name__)


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


@health_notes_bp.post("/add-healthnote")
def add_health_notes():
    """Create health notes for one or more animals.

    Based on the old api/healthnote/add-healthnote endpoint, but extended to
    support multiple animals in a single request.

    Expected JSON body:
      {
        "animalIds": [1, 2],
        "note": "Health note text",
        "actionDate": "2025-01-12"   # optional, defaults to today (UTC)
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    note_text = (payload.get("note") or "").strip()
    action_raw = (payload.get("actionDate") or "").strip()

    if not raw_ids or not note_text:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds and note are required."],
                }
            ),
            400,
        )

    try:
        animal_ids = [int(aid) for aid in raw_ids]
    except (TypeError, ValueError):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds must be a list of integers."],
                }
            ),
            400,
        )

    if action_raw:
        try:
            action_date = datetime.fromisoformat(action_raw)
        except ValueError:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Invalid actionDate format."],
                    }
                ),
                400,
            )
    else:
        action_date = datetime.utcnow()

    animals = Animal.query.filter(Animal.id.in_(animal_ids)).all()
    if not animals:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["No matching animals found."],
                }
            ),
            404,
        )

    now = datetime.utcnow()
    created: list[dict] = []

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        hn = HealthNote(
            animal_id=animal.id,
            note=note_text,
            date_entered=now,
            entered_by="system",
            is_deleted=False,
            tenant_id=tenant_id,
            action_date=action_date,
        )

        db.session.add(hn)
        db.session.flush()

        created.append(
            {
                "id": hn.id,
                "animalId": animal.id,
                "date": action_date.date().isoformat(),
                "note": note_text,
            }
        )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Health note entry added successfully",
            "data": {"items": created},
        }
    )


@health_notes_bp.get("/by-animal/<int:animal_id>")
def get_health_notes_by_animal(animal_id: int):
    """Return all health notes for a given animal."""

    if animal_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal identifier required."],
                }
            ),
            400,
        )

    notes = (
        HealthNote.query.filter_by(animal_id=animal_id, is_deleted=False)
        .order_by(HealthNote.action_date.desc())
        .all()
    )

    items: list[dict] = []
    for note in notes:
        date = note.action_date or note.date_entered or datetime.utcnow()
        items.append(
            {
                "id": note.id,
                "animalId": note.animal_id,
                "date": date.date().isoformat(),
                "note": note.note,
            }
        )

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Health notes retrieved successfully",
            "data": {"items": items},
        }
    )


@health_notes_bp.post("/update-healthnote/<int:health_note_id>")
@jwt_required(optional=True)
def update_health_note(health_note_id: int):
    """Update a health note entry.
    
    Based on the old api/healthnote/update-healthnote/{id} endpoint.
    
    Expected JSON body:
      {
        "note": "Updated health note text",
        "animalId": 1,
        "actionDate": "2025-01-12"  # optional
      }
    """
    if health_note_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Health Note Identifier must be greater than 0"],
                }
            ),
            400,
        )

    payload = request.get_json(silent=True) or {}
    note_text = (payload.get("note") or "").strip()
    animal_id = payload.get("animalId")
    action_date_raw = payload.get("actionDate", "").strip()

    if not note_text:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Note is required."],
                }
            ),
            400,
        )

    if not animal_id:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["AnimalId is required."],
                }
            ),
            400,
        )

    try:
        animal_id = int(animal_id)
    except (TypeError, ValueError):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["AnimalId must be an integer."],
                }
            ),
            400,
        )

    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()

    try:
        # Find the health note
        health_note = HealthNote.query.get(health_note_id)
        
        if not health_note:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["No record found"],
                        "data": {"id": health_note_id, "healthNote": None},
                    }
                ),
                400,
            )

        # Filter by tenant if tenant_id is available
        if tenant_id and health_note.tenant_id != tenant_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 403,
                        "errors": ["Unauthorized: Health note does not belong to your tenant"],
                    }
                ),
                403,
            )

        # Verify animal exists and belongs to tenant
        animal = Animal.query.get(animal_id)
        if not animal:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 404,
                        "errors": ["Animal not found"],
                    }
                ),
                404,
            )

        if tenant_id and animal.tenant_id != tenant_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 403,
                        "errors": ["Unauthorized: Animal does not belong to your tenant"],
                    }
                ),
                403,
            )

        # Update health note fields
        health_note.note = note_text
        health_note.animal_id = animal_id
        health_note.is_deleted = False
        health_note.date_modified = datetime.utcnow()
        if username:
            health_note.modified_by = username

        # Update action_date if provided
        if action_date_raw:
            try:
                action_date = datetime.fromisoformat(action_date_raw)
                health_note.action_date = action_date
            except ValueError:
                return (
                    jsonify(
                        {
                            "success": False,
                            "statusCode": 400,
                            "errors": ["Invalid actionDate format."],
                        }
                    ),
                    400,
                )

        db.session.commit()

        # Return updated health note
        date = health_note.action_date or health_note.date_entered or datetime.utcnow()
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Health note entry updated successfully",
                "data": {
                    "id": health_note.id,
                    "healthNote": {
                        "id": health_note.id,
                        "animalId": health_note.animal_id,
                        "date": date.date().isoformat(),
                        "note": health_note.note,
                    },
                },
            }
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Oops! Something went wrong while updating health note entry record: {str(e)}"],
                }
            ),
            400,
        )


@health_notes_bp.patch("/delete-healthnote/<int:health_note_id>")
@jwt_required(optional=True)
def delete_health_note(health_note_id: int):
    """Soft delete a health note entry.
    
    Based on the old api/healthnote/delete-healthnote/{id} endpoint.
    """
    if health_note_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Health Note identifier must be greater than 0"],
                }
            ),
            400,
        )

    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()

    try:
        # Find the health note
        health_note = HealthNote.query.get(health_note_id)
        
        if not health_note:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Record not found"],
                        "message": "Health note entry not found.",
                    }
                ),
                400,
            )

        # Filter by tenant if tenant_id is available
        if tenant_id and health_note.tenant_id != tenant_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 403,
                        "errors": ["Unauthorized: Health note does not belong to your tenant"],
                    }
                ),
                403,
            )

        # Soft delete
        health_note.is_deleted = True
        health_note.date_modified = datetime.utcnow()
        if username:
            health_note.modified_by = username

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Health note entry deleted successfully!",
                "data": {
                    "isDeleted": health_note.is_deleted,
                },
            }
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Oops! Something went wrong while updating health note entry record: {str(e)}"],
                }
            ),
            400,
        )


