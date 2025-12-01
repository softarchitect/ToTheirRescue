from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal, AnimalVaccination, AnimalProcedure, HealthNote, SOAP


health_history_bp = Blueprint("health_history", __name__)


@health_history_bp.get("/get-health-history")
def get_health_history_by_animal():
    """Return combined health history for a single animal.

    Rough analogue of the old api/health-history/get-health-history endpoint.

    Query string:
      - animalId: required
    """

    try:
        animal_id = int(request.args.get("animalId", "0"))
    except (TypeError, ValueError):
        animal_id = 0

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

    animal: Animal | None = Animal.query.get(animal_id)
    if not animal:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["No matching animal found."],
                }
            ),
            404,
        )

    tenant_id = animal.tenant_id or 0

    items: list[dict] = []

    # Vaccinations (completed, not reminders)
    vaccs = (
        AnimalVaccination.query.filter_by(
            animal_id=animal_id,
            tenant_id=tenant_id,
            is_deleted=False,
            reminder=False,
        )
        .all()
    )
    for av in vaccs:
        kind = ""
        clinic = ""
        # In the old system Kind and Clinic were resolved via joins. For now we
        # keep a simple placeholder text until lookup tables are wired.
        if av.kind_id:
            kind = f"Vaccination #{av.kind_id}"
        if av.hospital_clinic_id:
            clinic = f"Clinic #{av.hospital_clinic_id}"

        date = av.action_date or av.due_date or av.date_entered or datetime.utcnow()
        notes_parts = [av.notes or ""]
        if av.vaccine_manufacturer:
            notes_parts.append(f"Manufacturer: {av.vaccine_manufacturer}")
        if av.vaccine_serial_no:
            notes_parts.append(f"Serial: {av.vaccine_serial_no}")
        notes = " | ".join(p for p in notes_parts if p)

        items.append(
            {
                "date": date.date().isoformat(),
                "type": "Vaccination",
                "kind": kind,
                "clinic": clinic,
                "notes": notes,
            }
        )

    # Procedures (completed, not reminders)
    procs = (
        AnimalProcedure.query.filter_by(
            animal_id=animal_id,
            tenant_id=tenant_id,
            is_deleted=False,
            reminder=False,
        )
        .all()
    )
    for ap in procs:
        kind = f"Procedure #{ap.kind_id}" if ap.kind_id else ""
        clinic = (
            f"Clinic #{ap.hospital_clinic_id}" if ap.hospital_clinic_id else ""
        )
        date = ap.action_date or ap.due_date or ap.date_entered or datetime.utcnow()

        notes_parts = [ap.notes or "", ap.results or ""]
        notes = " | ".join(p for p in notes_parts if p)

        items.append(
            {
                "date": date.date().isoformat(),
                "type": "Procedure",
                "kind": kind,
                "clinic": clinic,
                "notes": notes,
            }
        )

    # Health notes
    notes = (
        HealthNote.query.filter_by(
            animal_id=animal_id,
            tenant_id=tenant_id,
            is_deleted=False,
        )
        .all()
    )
    for hn in notes:
        date = hn.action_date or hn.date_entered or datetime.utcnow()
        items.append(
            {
                "date": date.date().isoformat(),
                "type": "Health Note",
                "kind": "",
                "clinic": "",
                "notes": hn.note,
            }
        )

    # SOAPs
    soaps = (
        SOAP.query.filter_by(
            animal_id=animal_id,
            tenant_id=tenant_id,
            is_deleted=False,
        )
        .all()
    )
    for s in soaps:
        date = s.action_date or s.date_entered or datetime.utcnow()
        clinic = f"Clinic #{s.hospital_clinic_id}" if s.hospital_clinic_id else ""
        notes = s.soap_plan or ""

        items.append(
            {
                "date": date.date().isoformat(),
                "type": "SOAP",
                "kind": "",
                "clinic": clinic,
                "notes": notes,
            }
        )

    # Sort ascending by date, like the old repository
    items.sort(key=lambda x: x["date"])

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Health history retrieved successfully",
            "data": {"healthHistories": items},
        }
    )


