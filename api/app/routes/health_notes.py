from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal, HealthNote


health_notes_bp = Blueprint("health_notes", __name__)


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



