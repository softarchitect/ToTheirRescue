from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal
from ..models.med import Med


meds_bp = Blueprint("meds", __name__)


@meds_bp.post("/add-meds")
def add_meds():
    """Create reminder-only Med records for one or more animals.

    This is a simplified analogue of the old MedController.AddMedAsync used
    when creating medicine reminders from the SetReminderModal.

    Expected body:
      {
        "animalIds": [1, 2],
        "itemName": "Heartworm Prevention",
        "dueDates": ["2025-01-10"],
        "dosage": "1 tablet",
        "notes": "Monthly"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    item_name = (payload.get("itemName") or "").strip()
    due_dates_raw = payload.get("dueDates") or []
    dosage = (payload.get("dosage") or "").strip()
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
            med = Med(
                animal_id=animal.id,
                medicine_id=1,  # placeholder until medicine lookup is wired
                administered_date=None,
                due_date=due_date,
                notes=notes or item_name,
                administered_by=None,
                date_entered=now,
                entered_by="system",
                is_deleted=False,
                tenant_id=tenant_id,
                reminder=True,
                clinic=None,
                dosage=dosage or None,
                prescription_record_no=0,
                veterinarian=None,
            )

            db.session.add(med)

            created.append(
                {
                    "animalId": animal.id,
                    "type": "meds",
                    "itemName": item_name,
                    "dueDate": due_date.date().isoformat(),
                }
            )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Medicine reminders created successfully",
            "data": {"items": created},
        }
    )


@meds_bp.post("/create-completed-meds")
def create_completed_meds():
    """Create completed (non-reminder) Med records for one or more animals.

    This backs the \"Add New Medication\" dialog in the UI and is a simplified
    analogue of the old MedController.AddMedAsync for completed meds.

    Expected body (simplified):
      {
        "animalIds": [1, 2],
        "medicineName": "Doxycycline",
        "dosage": "50mg",
        "frequency": "BID",
        "startDate": "2025-01-10",
        "notes": "With food",
        "personAdministering": "Dr. Smith"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    medicine_name = (payload.get("medicineName") or "").strip()
    dosage = (payload.get("dosage") or "").strip()
    frequency = (payload.get("frequency") or "").strip()
    start_raw = (payload.get("startDate") or "").strip()
    notes = (payload.get("notes") or "").strip()
    person_admin = (payload.get("personAdministering") or "").strip()

    if not raw_ids or not medicine_name or not start_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "animalIds, medicineName and startDate are required."
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
        start_date = datetime.fromisoformat(start_raw)
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid startDate format."],
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

    combined_notes = notes or ""
    if frequency:
        combined_notes = (combined_notes + "\n" if combined_notes else "") + f"Frequency: {frequency}"

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        med = Med(
            animal_id=animal.id,
            medicine_id=1,  # placeholder until medicine lookup is wired
            administered_date=start_date,
            due_date=None,
            notes=combined_notes or None,
            administered_by=person_admin or None,
            date_entered=now,
            entered_by="system",
            is_deleted=False,
            tenant_id=tenant_id,
            reminder=False,
            clinic=None,
            dosage=dosage or None,
            prescription_record_no=0,
            veterinarian=None,
        )

        db.session.add(med)

        created.append(
            {
                "id": med.id,
                "animalId": animal.id,
                "date": start_date.date().isoformat(),
                "medicine": medicine_name,
                "dosage": dosage,
                "personAdministering": person_admin,
                "notes": notes,
            }
        )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Medication recorded successfully",
            "data": {"items": created},
        }
    )
