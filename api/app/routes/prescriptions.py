from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, Medicine, User
from ..models.med import Med
from ..models.prescription import Prescription


prescriptions_bp = Blueprint("prescriptions", __name__)


def _get_tenant_id_from_jwt():
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


def _get_username_from_jwt():
    claims = get_jwt()
    return claims.get("username", "") or "system"


def _parse_date(raw: str) -> datetime | None:
    raw_str = (raw or "").strip()
    if not raw_str:
        return None
    try:
        return datetime.fromisoformat(raw_str)
    except ValueError:
        return None


def _find_medicine_id(medicine_name: str, tenant_id: int) -> int:
    """Look up a Medicine row for the prescription medicine name.

    One-off names typed by staff are deliberately not added to the tenant's
    Customization catalog; the name is kept on the Med row instead.
    """
    name = (medicine_name or "").strip()
    if not name:
        return 0

    existing = (
        Medicine.query.filter(
            Medicine.tenant_id == tenant_id,
            Medicine.is_deleted.is_(False),
            Medicine.medicine_name == name,
        )
        .order_by(Medicine.id.asc())
        .first()
    )
    return existing.id if existing else 0


def _duration_day_count(duration_value: int, duration_unit: str) -> int:
    unit = (duration_unit or "days").strip().lower()
    if unit.startswith("week"):
        return max(1, duration_value) * 7
    if unit.startswith("month"):
        return max(1, duration_value) * 30
    return max(1, duration_value)


STOP_REMINDER_CREATION = "stop reminder creation"


def _build_due_dates(
    start_date: datetime,
    duration_mode: str,
    duration_value: int | None,
    duration_unit: str | None,
    until_option: str | None = None,
) -> list[datetime]:
    """Create one reminder due date per day for a For-duration.

    Open-ended durations have no end date, so a single reminder is created on the
    start date, except for "Stop Reminder Creation" which creates none at all.
    """
    if (duration_mode or "for").strip().lower() != "for":
        if (until_option or "").strip().lower() == STOP_REMINDER_CREATION:
            return []
        return [start_date]

    days = _duration_day_count(int(duration_value or 1), duration_unit or "days")
    return [start_date + timedelta(days=offset) for offset in range(days)]


def _serialize_prescription(rx: Prescription) -> dict:
    start = rx.start_date or rx.date_entered or datetime.utcnow()
    return {
        "id": rx.id,
        "animalId": rx.animal_id,
        "prescriptionText": rx.prescription_text,
        "clinic": rx.clinic or "",
        "veterinarian": rx.veterinarian or "",
        "specialInstructions": rx.special_instructions or "",
        "duration": rx.duration or "",
        "startDate": start.date().isoformat() if start else None,
        "dateEntered": (
            rx.date_entered.date().isoformat() if rx.date_entered else None
        ),
    }


@prescriptions_bp.post("/add-prescriptions")
@jwt_required(optional=True)
def add_prescriptions():
    """Create prescriptions and linked ungiven med reminders.

    Expected body:
      {
        "animalIds": [1, 2],
        "prescriptionText": "Baytril, 250 mg, 1 time(s) a day, ...",
        "clinic": "Clinic Name",
        "veterinarian": "Dr. Smith",          # optional
        "medicineName": "Baytril",
        "dosage": "250 mg",                   # optional
        "timesADay": 1,
        "durationMode": "for" | "until",
        "durationValue": 3,                   # for mode
        "durationUnit": "days" | "weeks" | "months",
        "untilOption": "until otherwise directed" | "stop reminder creation",
        "startDate": "2024-07-26",
        "specialInstructions": "..."          # optional
      }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    prescription_text = (payload.get("prescriptionText") or "").strip()
    clinic = (payload.get("clinic") or "").strip()
    veterinarian = (payload.get("veterinarian") or "").strip()
    medicine_name = (payload.get("medicineName") or "").strip()
    dosage = (payload.get("dosage") or "").strip()
    special_instructions = (payload.get("specialInstructions") or "").strip()
    duration_mode = (payload.get("durationMode") or "for").strip().lower()
    duration_unit = (payload.get("durationUnit") or "days").strip().lower()
    until_option = (payload.get("untilOption") or "").strip()
    start_raw = (payload.get("startDate") or "").strip()

    try:
        times_a_day = int(payload.get("timesADay") or 1)
    except (TypeError, ValueError):
        times_a_day = 1

    try:
        duration_value = int(payload.get("durationValue") or 1)
    except (TypeError, ValueError):
        duration_value = 1

    if not raw_ids or not prescription_text or not clinic or not medicine_name or not start_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "animalIds, prescriptionText, clinic, medicineName and startDate are required."
                    ],
                }
            ),
            400,
        )

    if times_a_day < 1:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["timesADay must be at least 1."],
                }
            ),
            400,
        )

    if duration_mode == "for" and duration_value < 1:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["durationValue must be at least 1."],
                }
            ),
            400,
        )

    if duration_mode == "until" and not until_option:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["untilOption is required when durationMode is until."],
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

    start_date = _parse_date(start_raw)
    if not start_date:
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

    username = _get_username_from_jwt()
    now = datetime.utcnow()
    due_dates = _build_due_dates(
        start_date, duration_mode, duration_value, duration_unit, until_option
    )
    # Only open-ended durations are stored; fixed durations live in the text.
    stored_duration = until_option if duration_mode == "until" else None
    created: list[dict] = []

    try:
        for animal in animals:
            tenant_id = animal.tenant_id or 0
            medicine_id = _find_medicine_id(medicine_name, tenant_id)

            rx = Prescription(
                animal_id=animal.id,
                prescription_text=prescription_text,
                clinic=clinic,
                veterinarian=veterinarian or None,
                special_instructions=special_instructions or None,
                duration=stored_duration,
                start_date=start_date,
                date_entered=now,
                entered_by=username,
                is_deleted=False,
                tenant_id=tenant_id,
            )
            db.session.add(rx)
            db.session.flush()

            reminder_notes = prescription_text
            if times_a_day > 1:
                reminder_notes = f"{prescription_text} ({times_a_day} time(s) a day)"
            if special_instructions:
                reminder_notes = f"{reminder_notes}\n{special_instructions}"

            for due_date in due_dates:
                # One med reminder per calendar day; times-a-day lives in the stored text.
                med = Med(
                    animal_id=animal.id,
                    medicine_id=medicine_id,
                    medicine_name=medicine_name if not medicine_id else None,
                    administered_date=None,
                    due_date=due_date,
                    notes=reminder_notes,
                    administered_by=None,
                    date_entered=now,
                    entered_by=username,
                    is_deleted=False,
                    tenant_id=tenant_id,
                    reminder=True,
                    clinic=clinic,
                    dosage=dosage or None,
                    prescription_record_no=rx.id,
                    veterinarian=veterinarian or None,
                )
                db.session.add(med)

            created.append(_serialize_prescription(rx))

        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Failed to create prescription: {exc}"],
                }
            ),
            400,
        )

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Prescription created successfully",
            "data": {"items": created},
        }
    )


@prescriptions_bp.get("/get-prescriptions")
@jwt_required(optional=True)
def get_prescriptions():
    """List non-deleted prescriptions for an animal."""
    animal_id_raw = request.args.get("animalId")
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

    query = Prescription.query.filter_by(animal_id=animal_id, is_deleted=False)
    tenant_id = _get_tenant_id_from_jwt()
    if tenant_id is not None:
        query = query.filter_by(tenant_id=tenant_id)

    prescriptions = query.order_by(Prescription.date_entered.desc()).all()
    items = [_serialize_prescription(rx) for rx in prescriptions]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Prescriptions retrieved successfully",
            "data": {"items": items},
        }
    )


@prescriptions_bp.patch("/delete-prescription/<int:prescription_id>")
@jwt_required(optional=True)
def delete_prescription(prescription_id: int):
    """Soft-delete a prescription and any ungiven med reminders it created.

    Given (administered) meds linked to the prescription are kept.
    """
    if prescription_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Prescription identifier must be greater than 0"],
                }
            ),
            400,
        )

    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()

    try:
        rx = Prescription.query.get(prescription_id)
        if not rx or rx.is_deleted:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 404,
                        "errors": ["Prescription not found."],
                    }
                ),
                404,
            )

        if tenant_id is not None and rx.tenant_id != tenant_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 403,
                        "errors": ["Not authorized to delete this prescription."],
                    }
                ),
                403,
            )

        now = datetime.utcnow()
        rx.is_deleted = True
        rx.date_modified = now
        rx.modified_by = username

        # Delete ungiven med reminders created by this prescription.
        # Ungiven = still a reminder and never administered.
        ungiven = Med.query.filter(
            Med.prescription_record_no == prescription_id,
            Med.is_deleted.is_(False),
            Med.reminder.is_(True),
            Med.administered_date.is_(None),
        ).all()

        deleted_med_count = 0
        for med in ungiven:
            med.is_deleted = True
            med.date_modified = now
            med.modified_by = username
            deleted_med_count += 1

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Prescription deleted successfully",
                "data": {
                    "isDeleted": True,
                    "ungivenMedsDeleted": deleted_med_count,
                },
            }
        )
    except Exception as exc:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Failed to delete prescription: {exc}"],
                }
            ),
            400,
        )
