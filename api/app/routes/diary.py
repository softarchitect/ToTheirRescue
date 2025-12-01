from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Diary, Animal


diary_bp = Blueprint("diary", __name__)


@diary_bp.post("/add-diary")
def add_diary():
    """Create a diary entry for one or more animals.

    Simplified version of old api/diary/add-diary.

    Expected JSON body:
      {
        "animalIds": [1, 2],
        "date": "2025-01-12",
        "notes": "string"
      }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    date_raw = (payload.get("date") or "").strip()
    notes = (payload.get("notes") or "").strip()

    if not raw_ids or not date_raw or not notes:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds, date, and notes are required."],
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

    try:
        action_date = datetime.fromisoformat(date_raw)
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid date format."],
                }
            ),
            400,
        )

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

    created = []
    now = datetime.utcnow()
    for animal in animals:
        entry = Diary(
            animal_id=animal.id,
            tenant_or_animal="animal",
            action_date=action_date,
            notes=notes,
            date_entered=now,
            entered_by="system",
            tenant_id=animal.tenant_id or 0,
            animal=animal.animal_name or "",
            is_deleted=False,
        )
        db.session.add(entry)
        created.append(entry)

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Diary entry added successfully",
            "data": {
                "diaries": [
                    {
                        "id": d.id,
                        "animalId": d.animal_id,
                        "date": d.action_date.date().isoformat(),
                        "notes": d.notes,
                    }
                    for d in created
                ]
            },
        }
    )



