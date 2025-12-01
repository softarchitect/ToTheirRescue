from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal
from ..models.animal_vaccination import AnimalVaccination


animal_vaccinations_bp = Blueprint("animal_vaccinations", __name__)


@animal_vaccinations_bp.post("/add-animal-vaccinations")
def add_animal_vaccinations():
    """Create completed vaccinations (and optional follow-up reminders) for animals.

    This endpoint is used by the \"Add New Completed Vaccination\" dialog.
    For reminder‑only records created from the Set New Reminders flow,
    see ``POST /api/animal-vaccination/add-reminders`` below.
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
    tag_number = (payload.get("tagNumber") or "").strip()
    vaccine_mfg = (payload.get("vaccineManufacturer") or "").strip()
    vaccine_serial_no = (payload.get("vaccineSerialNo") or "").strip()
    notes = (payload.get("notes") or "").strip()
    reminder_flag = bool(payload.get("reminder"))

    due_again_str = (payload.get("dueAgain") or "").strip()
    due_again_days = int(due_again_str) if due_again_str.isdigit() else 0

    created: list[dict] = []
    now = datetime.utcnow()

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        # Generate a simple vacc record number similar in spirit to the old code.
        vacc_record_no = (
            f"VAC{animal.id}{tenant_id}{now.month}{now.day}{now.year}{now.second}{now.microsecond}"
        )

        # Completed vaccination entry (no reminder).
        completed = AnimalVaccination(
            animal_id=animal.id,
            kind_id=int(kind_id),
            reminder=False,
            due_date=None,
            action_date=action_date,
            administerer=administerer or None,
            tag_number=tag_number or None,
            vaccine_manufacturer=vaccine_mfg or None,
            vaccine_serial_no=vaccine_serial_no or None,
            notes=notes or None,
            is_deleted=False,
            date_entered=now,
            entered_by="system",
            tenant_id=tenant_id,
            hospital_clinic_id=int(hospital_clinic_id),
            due_again=due_again_str or None,
            vacc_record_no="0" if not due_again_str else vacc_record_no,
        )
        db.session.add(completed)

        created.append(
            {
                "animalId": animal.id,
                "kindId": int(kind_id),
                "actionDate": action_date.date().isoformat(),
                "reminder": False,
            }
        )

        # Optional reminder entry with DueDate set.
        if reminder_flag and due_again_days > 0:
            due_date = action_date + timedelta(days=due_again_days)
            reminder = AnimalVaccination(
                animal_id=animal.id,
                kind_id=int(kind_id),
                reminder=True,
                due_date=due_date,
                action_date=None,
                administerer=None,
                tag_number=None,
                vaccine_manufacturer=None,
                vaccine_serial_no=None,
                notes=None,
                is_deleted=False,
                date_entered=now,
                entered_by="system",
                tenant_id=tenant_id,
                hospital_clinic_id=int(hospital_clinic_id),
                due_again=due_again_str or None,
                vacc_record_no=vacc_record_no,
            )
            db.session.add(reminder)

            created.append(
                {
                    "animalId": animal.id,
                    "kindId": int(kind_id),
                    "dueDate": due_date.date().isoformat(),
                    "reminder": True,
                }
            )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Vaccination recorded successfully",
            "data": {"items": created},
        }
    )


@animal_vaccinations_bp.post("/add-reminders")
def add_vaccination_reminders():
    """Create reminder-only AnimalVaccination records for one or more animals.

    This mirrors the old SetReminderModal behaviour where only Reminder/DueDate
    are populated (no completed ActionDate).

    Expected body (simplified):
      {
        "animalIds": [1, 2],
        "itemName": "Rabies",
        "dueDates": ["2025-01-10", "2025-02-10"],
        "notes": "Booster shots"
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
            record = AnimalVaccination(
                animal_id=animal.id,
                kind_id=1,  # placeholder until lookup tables are wired
                reminder=True,
                due_date=due_date,
                action_date=None,
                administerer=None,
                tag_number=None,
                vaccine_manufacturer=None,
                vaccine_serial_no=None,
                notes=notes or item_name,
                is_deleted=False,
                date_entered=now,
                entered_by="system",
                tenant_id=tenant_id,
                hospital_clinic_id=1,  # placeholder clinic
                due_again=None,
                vacc_record_no=None,
            )
            db.session.add(record)

            created.append(
                {
                    "animalId": animal.id,
                    "type": "vaccination",
                    "itemName": item_name,
                    "dueDate": due_date.date().isoformat(),
                }
            )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Vaccination reminders created successfully",
            "data": {"items": created},
        }
    )

