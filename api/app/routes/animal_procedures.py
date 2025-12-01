from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal
from ..models.animal_procedure import AnimalProcedure


animal_procedures_bp = Blueprint("animal_procedures", __name__)


@animal_procedures_bp.post("/add-animal-procedures")
def add_animal_procedures():
    """Create completed procedures/tests/treatments for one or more animals.

    Simplified analogue of the old api/animal-procedure/add-animal-procedures.

    Body:
      {
        "animalIds": [1,2],
        "kindId": 1,
        "actionDate": "2025-01-12",
        "hospitalClinicId": 1,
        "results": "Negative",
        "microchipNumber": "123",
        "notes": "Procedure notes",
        "administerer": "Dr. Smith"
      }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    kind_id = payload.get("kindId")
    action_raw = (payload.get("actionDate") or "").strip()
    hospital_clinic_id = payload.get("hospitalClinicId")

    if not raw_ids or not kind_id or not action_raw or not hospital_clinic_id:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "animalIds, kindId, hospitalClinicId and actionDate are required."
                    ],
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

    administerer = (payload.get("administerer") or "").strip()
    microchip_number = (payload.get("microchipNumber") or "").strip()
    results = (payload.get("results") or "").strip()
    notes = (payload.get("notes") or "").strip()

    created: list[dict] = []
    now = datetime.utcnow()

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        proc = AnimalProcedure(
            animal_id=animal.id,
            kind_id=int(kind_id),
            reminder=False,
            due_date=None,
            action_date=action_date,
            weight=None,
            administerer=administerer or None,
            results=results or None,
            microchip_number=microchip_number or None,
            notes=notes or None,
            is_deleted=False,
            date_entered=now,
            entered_by="system",
            tenant_id=tenant_id,
            hospital_clinic_id=int(hospital_clinic_id),
        )

        db.session.add(proc)

        created.append(
            {
                "animalId": animal.id,
                "kindId": int(kind_id),
                "actionDate": action_date.date().isoformat(),
            }
        )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Procedure recorded successfully",
            "data": {"items": created},
        }
    )


@animal_procedures_bp.post("/add-reminders")
def add_procedure_reminders():
    """Create reminder-only AnimalProcedure records for one or more animals.

    Mirrors the old SetReminderModal behaviour (Reminder/due date only, no action).

    Expected body (simplified):
      {
        "animalIds": [1, 2],
        "itemName": "Dental Cleaning",
        "dueDates": ["2025-01-10"],
        "notes": "Pre-visit bloodwork"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    item_name = (payload.get("itemName") or "").strip()
    due_dates_raw = payload.get("dueDates") or []
    notes = (payload.get("notes") or "").strip()

    if not raw_ids or not item_name or not due_dates_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "animalIds, itemName and at least one due date are required."
                    ],
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

    parsed_dates: list[datetime] = []
    for raw in due_dates_raw:
        raw_str = (raw or "").strip()
        if not raw_str:
            continue
        try:
            parsed_dates.append(datetime.fromisoformat(raw_str))
        except ValueError:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": [f"Invalid due date format: {raw_str}"],
                    }
                ),
                400,
            )

    if not parsed_dates:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["At least one valid due date is required."],
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

    now = datetime.utcnow()
    created: list[dict] = []

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        for due_date in parsed_dates:
            record = AnimalProcedure(
                animal_id=animal.id,
                kind_id=1,  # placeholder until health procedures lookup is wired
                reminder=True,
                due_date=due_date,
                action_date=None,
                weight=None,
                administerer=None,
                results=None,
                microchip_number=None,
                notes=notes or item_name,
                is_deleted=False,
                date_entered=now,
                entered_by="system",
                tenant_id=tenant_id,
                hospital_clinic_id=1,  # placeholder clinic
            )
            db.session.add(record)

            created.append(
                {
                    "animalId": animal.id,
                    "type": "procedure",
                    "itemName": item_name,
                    "dueDate": due_date.date().isoformat(),
                }
            )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Procedure reminders created successfully",
            "data": {"items": created},
        }
    )

