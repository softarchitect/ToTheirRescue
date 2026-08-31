from collections import Counter
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

# Durations with no knowable end date. Rather than materialising an unbounded
# number of reminders up front, these keep a rolling window of reminders that
# is topped up whenever the meds list is read.
OPEN_ENDED_DURATIONS = {
    "until otherwise directed",
    "until supply is exhausted",
    "forever",
}

# How far ahead reminders are materialised for open-ended prescriptions.
REMINDER_HORIZON_DAYS = 30
# How far back the top-up will reconstruct missed doses for a dormant
# prescription, so a long-untouched course doesn't dump a year of rows.
REMINDER_BACKFILL_DAYS = 14


def _is_open_ended(duration: str | None) -> bool:
    return (duration or "").strip().lower() in OPEN_ENDED_DURATIONS


def _start_of_day(value: datetime) -> datetime:
    return datetime(value.year, value.month, value.day)


def _daily_doses(
    first_day: datetime, last_day: datetime, times_a_day: int
) -> list[datetime]:
    """One due date per dose for every day in an inclusive range."""
    doses_per_day = max(1, times_a_day)
    if last_day < first_day:
        return []

    total_days = (last_day.date() - first_day.date()).days + 1
    return [
        first_day + timedelta(days=offset)
        for offset in range(total_days)
        for _ in range(doses_per_day)
    ]


def _build_due_dates(
    start_date: datetime,
    duration_mode: str,
    duration_value: int | None,
    duration_unit: str | None,
    until_option: str | None = None,
    times_a_day: int = 1,
) -> list[datetime]:
    """Create one reminder due date per dose.

    A prescription taken twice a day for 5 days yields 10 reminders, so each
    dose can be checked off individually.

    Open-ended durations get the first window of the rolling schedule;
    "Stop Reminder Creation" creates none at all.
    """
    if (duration_mode or "for").strip().lower() != "for":
        option = (until_option or "").strip().lower()
        if option == STOP_REMINDER_CREATION or not _is_open_ended(option):
            return []
        horizon_end = _open_ended_horizon(start_date)
        return _daily_doses(_start_of_day(start_date), horizon_end, times_a_day)

    days = _duration_day_count(int(duration_value or 1), duration_unit or "days")
    return _daily_doses(
        _start_of_day(start_date),
        _start_of_day(start_date) + timedelta(days=days - 1),
        times_a_day,
    )


def _open_ended_horizon(start_date: datetime) -> datetime:
    """Last day reminders should exist for right now."""
    today = _start_of_day(datetime.utcnow())
    base = max(_start_of_day(start_date), today)
    return base + timedelta(days=REMINDER_HORIZON_DAYS)


def top_up_open_ended_reminders(animal_id: int) -> int:
    """Extend the rolling reminder window for an animal's open-ended courses.

    Safe to call on every read: it only creates the days that are missing, and
    records how far it has reached so it never duplicates.
    """
    prescriptions = Prescription.query.filter(
        Prescription.animal_id == animal_id,
        Prescription.is_deleted.is_(False),
        Prescription.reminders_stopped.is_(False),
    ).all()

    today = _start_of_day(datetime.utcnow())
    now = datetime.utcnow()
    created = 0

    for rx in prescriptions:
        if not _is_open_ended(rx.duration):
            continue

        horizon_end = _open_ended_horizon(rx.start_date or rx.date_entered or now)

        if rx.reminders_through:
            first_day = _start_of_day(rx.reminders_through) + timedelta(days=1)
        else:
            first_day = _start_of_day(rx.start_date or rx.date_entered or now)

        # Don't reconstruct an unbounded backlog for a dormant prescription.
        first_day = max(first_day, today - timedelta(days=REMINDER_BACKFILL_DAYS))
        # Never generate before the course actually started.
        if rx.start_date:
            first_day = max(first_day, _start_of_day(rx.start_date))

        due_dates = _daily_doses(first_day, horizon_end, rx.times_a_day or 1)
        if not due_dates:
            continue

        # Only create the doses a day is actually short of. The watermark alone
        # would double up if two requests top up at once, or if it ever moves
        # backwards; counting what's really there keeps this safe to re-run.
        wanted_per_day = Counter(due_date.date() for due_date in due_dates)
        existing_per_day = Counter(
            existing_due.date()
            for (existing_due,) in db.session.query(Med.due_date)
            .filter(
                Med.prescription_record_no == rx.id,
                Med.is_deleted.is_(False),
                Med.due_date >= first_day,
            )
            .all()
            if existing_due
        )

        due_dates = [
            due_date
            for day, wanted in sorted(wanted_per_day.items())
            for due_date in [datetime(day.year, day.month, day.day)]
            * max(0, wanted - existing_per_day.get(day, 0))
        ]

        if not due_dates:
            rx.reminders_through = horizon_end
            continue

        medicine_name = rx.medicine_name or ""
        medicine_id = _find_medicine_id(medicine_name, rx.tenant_id or 0)

        for due_date in due_dates:
            db.session.add(
                Med(
                    animal_id=rx.animal_id,
                    medicine_id=medicine_id,
                    medicine_name=medicine_name if not medicine_id else None,
                    administered_date=None,
                    due_date=due_date,
                    notes=rx.prescription_text,
                    administered_by=None,
                    date_entered=now,
                    entered_by=rx.entered_by or "system",
                    is_deleted=False,
                    tenant_id=rx.tenant_id or 0,
                    reminder=True,
                    clinic=rx.clinic,
                    dosage=rx.dosage,
                    prescription_record_no=rx.id,
                    veterinarian=rx.veterinarian,
                )
            )
            created += 1

        rx.reminders_through = horizon_end

    if created:
        db.session.commit()

    return created


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
        "openEnded": _is_open_ended(rx.duration),
        "remindersStopped": bool(rx.reminders_stopped),
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
        start_date,
        duration_mode,
        duration_value,
        duration_unit,
        until_option,
        times_a_day,
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
                medicine_name=medicine_name or None,
                dosage=dosage or None,
                times_a_day=times_a_day,
                reminders_through=(
                    _open_ended_horizon(start_date)
                    if _is_open_ended(stored_duration)
                    else None
                ),
                reminders_stopped=False,
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
                # One med reminder per dose, so each can be checked off separately.
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


@prescriptions_bp.patch("/stop-reminders/<int:prescription_id>")
@jwt_required(optional=True)
def stop_prescription_reminders(prescription_id: int):
    """End an open-ended course without deleting its history.

    Future ungiven reminders are removed and no more are generated; the
    prescription and any administered meds are kept.
    """
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
                        "errors": ["Not authorized to update this prescription."],
                    }
                ),
                403,
            )

        now = datetime.utcnow()
        rx.reminders_stopped = True
        rx.date_modified = now
        rx.modified_by = username

        ungiven = Med.query.filter(
            Med.prescription_record_no == prescription_id,
            Med.is_deleted.is_(False),
            Med.reminder.is_(True),
            Med.administered_date.is_(None),
        ).all()

        for med in ungiven:
            med.is_deleted = True
            med.date_modified = now
            med.modified_by = username

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Reminders stopped for this prescription",
                "data": {
                    "remindersStopped": True,
                    "ungivenMedsDeleted": len(ungiven),
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
                    "errors": [f"Failed to stop reminders: {exc}"],
                }
            ),
            400,
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
