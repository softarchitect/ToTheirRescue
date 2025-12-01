from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal, SOAP


soaps_bp = Blueprint("soaps", __name__)


@soaps_bp.post("/add-soap")
def add_soap_entries():
    """Create SOAP entries for one or more animals.

    Simplified analogue of the old api/soap/add-soap endpoint.

    Expected JSON body:
      {
        "animalIds": [1, 2],
        "actionDate": "2025-01-12",
        "subjective": "...",
        "objective": "...",
        "assessment": "...",
        "plan": "...",
        "veterinarian": "Dr. Smith",
        "hospitalClinicId": 1
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    action_raw = (payload.get("actionDate") or "").strip()
    subjective = (payload.get("subjective") or "").strip()
    objective = (payload.get("objective") or "").strip()
    assessment = (payload.get("assessment") or "").strip()
    plan = (payload.get("plan") or "").strip()
    veterinarian = (payload.get("veterinarian") or "").strip()
    hospital_clinic_id = payload.get("hospitalClinicId") or 1

    if not raw_ids:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal identifiers required"],
                }
            ),
            400,
        )

    if (
        not action_raw
        or not subjective
        or not objective
        or not assessment
        or not plan
        or not veterinarian
    ):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "actionDate, subjective, objective, assessment, plan and veterinarian are required."
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

    try:
        hospital_clinic_id_int = int(hospital_clinic_id)
    except (TypeError, ValueError):
        hospital_clinic_id_int = 1

    created: list[dict] = []
    now = datetime.utcnow()

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        soap = SOAP(
            action_date=action_date,
            subjective=subjective,
            objective=objective,
            assessment=assessment,
            soap_plan=plan,
            veterinarian=veterinarian,
            date_entered=now,
            entered_by="system",
            is_deleted=False,
            animal_id=animal.id,
            tenant_id=tenant_id,
            hospital_clinic_id=hospital_clinic_id_int,
        )

        db.session.add(soap)
        db.session.flush()

        created.append(
            {
                "id": soap.id,
                "animalId": animal.id,
                "date": action_date.date().isoformat(),
                "subjective": subjective,
                "objective": objective,
                "assessment": assessment,
                "plan": plan,
                "veterinarian": veterinarian,
            }
        )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "SOAP entry added successfully",
            "data": {"items": created},
        }
    )


@soaps_bp.get("/by-animal/<int:animal_id>")
def get_soaps_by_animal(animal_id: int):
    """Return all SOAP entries for a given animal."""

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

    soaps = (
        SOAP.query.filter_by(animal_id=animal_id, is_deleted=False)
        .order_by(SOAP.action_date.desc())
        .all()
    )

    items: list[dict] = []
    for soap in soaps:
        date = soap.action_date or soap.date_entered or datetime.utcnow()
        items.append(
            {
                "id": soap.id,
                "animalId": soap.animal_id,
                "date": date.date().isoformat(),
                "subjective": soap.subjective,
                "objective": soap.objective,
                "assessment": soap.assessment,
                "plan": soap.soap_plan,
                "veterinarian": soap.veterinarian,
            }
        )

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "SOAP entries retrieved successfully",
            "data": {"items": items},
        }
    )



