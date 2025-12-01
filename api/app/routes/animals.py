from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Animal
from ..models.animal_milestone import AnimalMilestone


animals_bp = Blueprint("animals", __name__)


@animals_bp.get("/get-animal")
def get_animals():
    """Simplified version of the old GET api/animal/get-animal endpoint.

    Query params:
      - searchText: filter by name or breed (case-insensitive)
      - isAvailable: if 'true', filter out deleted / non-current animals
      - page, limit: basic pagination
    """
    search_text = request.args.get("searchText", "", type=str)
    is_available = request.args.get("isAvailable", "false").lower() == "true"
    page = request.args.get("Page", request.args.get("page", 1, type=int), type=int)
    limit = request.args.get("Limit", request.args.get("limit", 20, type=int), type=int)

    query = Animal.query
    if search_text:
        pattern = f"%{search_text.lower()}%"
        query = query.filter(
            db.or_(
                db.func.lower(Animal.animal_name).like(pattern),
                db.func.lower(Animal.breed).like(pattern),
            )
        )

    if is_available:
        query = query.filter(Animal.is_deleted.is_(False))

    total_items = query.count()
    items = (
        query.order_by(Animal.date_entered.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    data = [a.to_dict_basic() for a in items]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal retrieved successfully",
            "data": {
                "currentPage": page,
                "totalItems": total_items,
                "totalPage": (total_items + limit - 1) // limit if limit else 1,
                "animalsList": data,
            },
        }
    )


@animals_bp.post("/create-animal")
def create_animal():
    """Subset of the original create-animal logic aligned with the new UI.

    Accepts JSON shaped like the new Animal dialog and inserts a single
    Animal row. Milestones and multi-animal cloning are not yet handled.
    """
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    if not name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal name is required."],
                }
            ),
            400,
        )

    # Optional intake date from the UI; falls back to "now".
    intake_date_raw = (payload.get("intakeDate") or "").strip()
    intake_date = None
    if intake_date_raw:
        try:
            # Expecting an ISO date (YYYY-MM-DD) from the frontend.
            intake_date = datetime.fromisoformat(intake_date_raw)
        except ValueError:
            intake_date = None

    # Birth milestone information: either an actual birthdate or an
    # approximate age (years / months) from which we derive the date.
    actual_birth_raw = (payload.get("actualBirthDate") or "").strip()
    approx_years = int(payload.get("approximateYears") or 0)
    approx_months = int(payload.get("approximateMonths") or 0)
    birth_notes = (payload.get("birthNotes") or "").strip() or None

    birth_date = None
    is_approx_dob = False

    if actual_birth_raw:
        try:
            birth_date = datetime.fromisoformat(actual_birth_raw)
        except ValueError:
            birth_date = None

    if birth_date is None and (approx_years or approx_months):
        # Very simple approximation: convert years / months to days.
        # This mirrors the old UI behaviour closely enough for reporting.
        days = approx_years * 365 + approx_months * 30
        birth_date = (intake_date or datetime.utcnow()) - timedelta(days=days)
        is_approx_dob = True

    # Intake milestone extra info.
    how_acquired = (payload.get("howAcquired") or "").strip()
    intake_cost = payload.get("intakeCost") or 0
    donation_amount = payload.get("donationAmount") or 0
    intake_notes = (payload.get("intakeNotes") or "").strip() or None

    # Create the base Animal row.
    animal = Animal(
        animal_name=name,
        breed=(payload.get("breed") or "").strip(),
        color=(payload.get("color") or "").strip(),
        sex=(payload.get("gender") or "").capitalize() or "Unknown",
        status=(payload.get("status") or "available").lower(),
        animal_type_name=(payload.get("type") or "").strip(),
        chronic_condition=(payload.get("chronicCondition") or "").strip(),
        publicity_blurb=(payload.get("description") or "").strip(),
        last_milestone="intake",
        last_milestone_date=intake_date or datetime.utcnow(),
    )

    db.session.add(animal)
    db.session.flush()  # Assigns animal.id without committing yet.

    # The original system required quite a few non-null fields on
    # AnimalMilestones. For now we populate them with safe defaults and
    # whatever we know from the new UI.
    tenant_id = animal.tenant_id or 0
    acquisition_way_id = 0
    other_rescue_shelter_id = 0
    pco_id = 0
    other_rescue_id_no = ""

    # Birth milestone (if we have a date).
    if birth_date is not None:
        birth_milestone = AnimalMilestone(
            milestone_type="Birth",
            milestone_date=birth_date,
            other_rescue_id_no=other_rescue_id_no,
            amount_paid_fee=0,
            amount_received_fee=0,
            notes=birth_notes,
            acquisition_way_id=acquisition_way_id,
            pco_id=pco_id,
            animal_id=animal.id,
            tenant_id=tenant_id,
            acquisition_way_name=how_acquired or "",
            other_rescue_shelter_id=other_rescue_shelter_id,
            is_approx_dob=is_approx_dob,
        )
        db.session.add(birth_milestone)

    # Intake milestone.
    intake_milestone = AnimalMilestone(
        milestone_type="Intake",
        milestone_date=intake_date or datetime.utcnow(),
        other_rescue_id_no=other_rescue_id_no,
        amount_paid_fee=intake_cost or 0,
        amount_received_fee=donation_amount or 0,
        notes=intake_notes,
        acquisition_way_id=acquisition_way_id,
        pco_id=pco_id,
        animal_id=animal.id,
        tenant_id=tenant_id,
        acquisition_way_name=how_acquired or "",
        other_rescue_shelter_id=other_rescue_shelter_id,
        is_approx_dob=False,
    )
    db.session.add(intake_milestone)

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal created successfully",
            "data": animal.to_dict_basic(),
        }
    )


@animals_bp.put("/update-animal-location")
def update_animal_location():
    """Update Location for one or more animals.

    Rough equivalent of the old
    api/animal/update-animal-location endpoint.

    Expected JSON body:
      {
        "animalIds": [1, 2, 3],
        "location": "New kennel row"
      }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    location = (payload.get("location") or "").strip()

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

    for animal in animals:
        animal.location = location
        animal.date_modified = datetime.utcnow()

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal location updated successfully",
        }
    )


@animals_bp.put("/update-animal-diet")
def update_animal_diet():
    """Update Diet text for one or more animals.

    Simplified analogue of the old api/animal/update-animal-diet endpoint.

    Expected JSON body:
      {
        "animalIds": [1, 2, 3],
        "diet": "Timothy hay + pellets; fresh greens once daily"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    diet_text = (payload.get("diet") or "").strip()

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
    for animal in animals:
        animal.diet = diet_text
        animal.date_modified = now

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal diet updated successfully",
        }
    )

