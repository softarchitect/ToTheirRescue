from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, Medicine, User
from ..models.med import Med


meds_bp = Blueprint("meds", __name__)


def get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


def get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "") or "system"


def find_medicine_id(medicine_name: str, tenant_id: int) -> int | None:
    """Look up the tenant Medicine row backing a med record.

    One-off names typed by staff are deliberately not added to the tenant's
    Customization catalog; callers keep them on the Med row instead.
    """
    name = (medicine_name or "").strip()
    if not name:
        return None

    existing = (
        Medicine.query.filter(
            Medicine.tenant_id == tenant_id,
            Medicine.is_deleted.is_(False),
            Medicine.medicine_name == name,
        )
        .order_by(Medicine.id.asc())
        .first()
    )
    return existing.id if existing else None


def serialize_med(med: Med, medicine_names: dict[int, str]) -> dict:
    """Shape a Med row for the UI, resolving the medicine display name."""
    name = medicine_names.get(med.medicine_id) or med.medicine_name or ""
    if not name:
        # Older reminders were stored with a placeholder medicine id.
        name = (med.notes or "").splitlines()[0] if med.notes else "Medication"

    return {
        "id": med.id,
        "animalId": med.animal_id,
        "medicine": name,
        "dosage": med.dosage or "",
        "notes": med.notes or "",
        "reminder": bool(med.reminder),
        "dueDate": med.due_date.date().isoformat() if med.due_date else None,
        "administeredDate": (
            med.administered_date.date().isoformat() if med.administered_date else None
        ),
        "personAdministering": med.administered_by or "",
        "clinic": med.clinic or "",
        "veterinarian": med.veterinarian or "",
        "prescriptionRecordNo": med.prescription_record_no or 0,
    }


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
        medicine_id = find_medicine_id(item_name, tenant_id) or 0

        for due_date in parsed_dates:
            med = Med(
                animal_id=animal.id,
                medicine_id=medicine_id,
                medicine_name=item_name if not medicine_id else None,
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

    This backs the \"Med Given\" dialog in the UI and is a simplified
    analogue of the old MedController.AddMedAsync for completed meds.

    Expected body (simplified):
      {
        "animalIds": [1, 2],
        "medicineName": "Doxycycline",
        "dosage": "50mg",
        "startDate": "2025-01-10",
        "notes": "With food",
        "personAdministering": "Dr. Smith"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    medicine_name = (payload.get("medicineName") or "").strip()
    dosage = (payload.get("dosage") or "").strip()
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

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        medicine_id = find_medicine_id(medicine_name, tenant_id) or 0

        med = Med(
            animal_id=animal.id,
            medicine_id=medicine_id,
            medicine_name=medicine_name if not medicine_id else None,
            administered_date=start_date,
            due_date=None,
            notes=notes or None,
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
        db.session.flush()

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


@meds_bp.get("/get-meds")
@jwt_required(optional=True)
def get_meds():
    """List meds for an animal.

    Query params:
      animalId (required)
      reminder: "true" returns outstanding reminders, "false" returns given meds,
                omitted returns both.
    """
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

    query = Med.query.filter(Med.animal_id == animal_id, Med.is_deleted.is_(False))

    tenant_id = get_tenant_id_from_jwt()
    if tenant_id is not None:
        query = query.filter(Med.tenant_id == tenant_id)

    reminder_raw = (request.args.get("reminder") or "").strip().lower()
    if reminder_raw in ("true", "1"):
        query = query.filter(Med.reminder.is_(True))
    elif reminder_raw in ("false", "0"):
        query = query.filter(Med.reminder.is_(False))

    meds = query.order_by(
        Med.due_date.desc().nullslast(), Med.administered_date.desc().nullslast()
    ).all()

    medicine_ids = {m.medicine_id for m in meds if m.medicine_id}
    medicine_names: dict[int, str] = {}
    if medicine_ids:
        for medicine in Medicine.query.filter(Medicine.id.in_(medicine_ids)).all():
            medicine_names[medicine.id] = medicine.medicine_name

    items = [serialize_med(m, medicine_names) for m in meds]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Meds retrieved successfully",
            "data": {"items": items},
        }
    )


@meds_bp.post("/mark-med-given/<int:med_id>")
@jwt_required(optional=True)
def mark_med_given(med_id: int):
    """Turn an outstanding reminder into a given med.

    Expected body (all optional):
      { "administeredDate": "2026-08-29", "personAdministering": "Dr. Smith" }
    """
    payload = request.get_json(silent=True) or {}
    administered_raw = (payload.get("administeredDate") or "").strip()
    person_admin = (payload.get("personAdministering") or "").strip()

    med = Med.query.get(med_id)
    if not med or med.is_deleted:
        return (
            jsonify({"success": False, "statusCode": 404, "errors": ["Med not found."]}),
            404,
        )

    tenant_id = get_tenant_id_from_jwt()
    if tenant_id is not None and med.tenant_id != tenant_id:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 403,
                    "errors": ["Not authorized to update this med."],
                }
            ),
            403,
        )

    if administered_raw:
        try:
            administered_date = datetime.fromisoformat(administered_raw)
        except ValueError:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Invalid administeredDate format."],
                    }
                ),
                400,
            )
    else:
        administered_date = datetime.utcnow()

    now = datetime.utcnow()
    med.administered_date = administered_date
    med.reminder = False
    med.date_modified = now
    med.modified_by = get_username_from_jwt()
    if person_admin:
        med.administered_by = person_admin

    db.session.commit()

    medicine_names: dict[int, str] = {}
    if med.medicine_id:
        medicine = Medicine.query.get(med.medicine_id)
        if medicine:
            medicine_names[medicine.id] = medicine.medicine_name

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Med marked as given",
            "data": {"item": serialize_med(med, medicine_names)},
        }
    )


@meds_bp.patch("/delete-med/<int:med_id>")
@jwt_required(optional=True)
def delete_med(med_id: int):
    """Soft delete a med record."""
    med = Med.query.get(med_id)
    if not med or med.is_deleted:
        return (
            jsonify({"success": False, "statusCode": 404, "errors": ["Med not found."]}),
            404,
        )

    tenant_id = get_tenant_id_from_jwt()
    if tenant_id is not None and med.tenant_id != tenant_id:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 403,
                    "errors": ["Not authorized to delete this med."],
                }
            ),
            403,
        )

    med.is_deleted = True
    med.date_modified = datetime.utcnow()
    med.modified_by = get_username_from_jwt()
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Med deleted successfully",
            "data": {"isDeleted": True},
        }
    )
