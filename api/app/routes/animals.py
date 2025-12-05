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


def _create_animal_with_milestones(
    *,
    base_name: str,
    suffix: int | None,
    sex: str,
    payload: dict,
    intake_date,
    birth_date,
    is_approx_dob: bool,
    birth_notes: str | None,
    how_acquired: str,
    per_animal_intake_cost: float,
    per_animal_donation_amount: float,
    intake_notes: str | None,
):
    """Internal helper to create one Animal and its birth/intake milestones."""

    name = base_name if suffix is None else f"{base_name}-{suffix}"

    animal = Animal(
        animal_name=name,
        breed=(payload.get("breed") or "").strip(),
        color=(payload.get("color") or "").strip(),
        sex=(sex or "").capitalize() or "Unknown",
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
    
    # Get acquisition way ID and name from howAcquired
    # howAcquired is passed as a parameter, but we also check payload for ID
    how_acquired_id_raw = payload.get("howAcquired") or how_acquired or ""
    acquisition_way_id = 0
    acquisition_way_name = how_acquired or ""
    
    try:
        acquisition_way_id = int(how_acquired_id_raw) if how_acquired_id_raw else 0
        # If we have an ID, try to get the name from the database
        if acquisition_way_id > 0:
            from ..models import AcquisitionWay
            acq_way = AcquisitionWay.query.filter(
                AcquisitionWay.id == acquisition_way_id,
                AcquisitionWay.is_deleted.is_(False)
            ).first()
            if acq_way:
                acquisition_way_name = acq_way.acquisition_way_name
    except (ValueError, TypeError):
        acquisition_way_id = 0
    
    # Get other rescue shelter ID and PCO ID from payload
    other_rescue_shelter_id = 0
    try:
        other_rescue_shelter_id_raw = payload.get("otherRescueShelterId")
        if other_rescue_shelter_id_raw is not None:
            other_rescue_shelter_id = int(other_rescue_shelter_id_raw)
    except (ValueError, TypeError):
        other_rescue_shelter_id = 0
    
    pco_id = 0
    try:
        pco_id_raw = payload.get("personOrRescueId")
        if pco_id_raw is not None:
            pco_id = int(pco_id_raw)
    except (ValueError, TypeError):
        pco_id = 0
    
    other_rescue_id_no = (payload.get("otherRescueID") or "").strip() or ""

    # Birth milestone (if we have a date).
    if birth_date is not None:
        birth_milestone = AnimalMilestone(
            milestone_type="Birth",
            milestone_date=birth_date,
            other_rescue_id_no=other_rescue_id_no,
            amount_paid_fee=per_animal_intake_cost or 0,
            amount_received_fee=per_animal_donation_amount or 0,
            notes=birth_notes,
            acquisition_way_id=acquisition_way_id,
            pco_id=pco_id,
            animal_id=animal.id,
            tenant_id=tenant_id,
            acquisition_way_name=acquisition_way_name,
            other_rescue_shelter_id=other_rescue_shelter_id,
            is_approx_dob=is_approx_dob,
        )
        db.session.add(birth_milestone)

    # Intake milestone.
    intake_milestone = AnimalMilestone(
        milestone_type="Intake",
        milestone_date=intake_date or datetime.utcnow(),
        other_rescue_id_no=other_rescue_id_no,
        amount_paid_fee=per_animal_intake_cost or 0,
        amount_received_fee=per_animal_donation_amount or 0,
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

    return animal


@animals_bp.post("/create-animal")
def create_animal():
    """Create one or more animals, cloning from a single detail form.

    Behaviour mirrors the legacy TYR multi-animal intake:

    - `animalCount` defaults to 1.
    - When `animalCount` > 1 the payload should also include
      `maleCount`, `femaleCount` and optional `unknownCount`.
      The sum of these must equal `animalCount`.
    - For multi-animal intake we create that many Animals, appending
      `-1`, `-2`, ... to the provided `name` to form individual names.
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

    # How many animals are being created?
    try:
        animal_count = int(payload.get("animalCount") or 1)
    except (TypeError, ValueError):
        animal_count = 1

    if animal_count < 1:
        animal_count = 1

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
    # howAcquired can be either an ID (number) or a name (string)
    # We'll extract the name from acquisition ways if it's an ID
    how_acquired_raw = payload.get("howAcquired") or ""
    how_acquired = how_acquired_raw  # Will be set to name if ID is found
    intake_cost_raw = payload.get("intakeCost") or 0
    donation_amount_raw = payload.get("donationAmount") or 0
    try:
        intake_cost = float(intake_cost_raw or 0)
    except (TypeError, ValueError):
        intake_cost = 0.0
    try:
        donation_amount = float(donation_amount_raw or 0)
    except (TypeError, ValueError):
        donation_amount = 0.0
    intake_notes = (payload.get("intakeNotes") or "").strip() or None

    # Split intake / donation amounts evenly across all created animals,
    # just like the legacy implementation.
    if animal_count > 0:
        per_animal_intake_cost = intake_cost / animal_count if intake_cost else 0
        per_animal_donation_amount = (
            donation_amount / animal_count if donation_amount else 0
        )
    else:
        per_animal_intake_cost = intake_cost
        per_animal_donation_amount = donation_amount

    created_animals: list[Animal] = []

    if animal_count == 1:
        # Single-animal case – preserve existing behaviour, using the
        # simple gender field from the payload.
        gender = (payload.get("gender") or "").lower() or "unknown"

        animal = _create_animal_with_milestones(
            base_name=name,
            suffix=None,
            sex=gender,
            payload=payload,
            intake_date=intake_date,
            birth_date=birth_date,
            is_approx_dob=is_approx_dob,
            birth_notes=birth_notes,
            how_acquired=how_acquired,
            per_animal_intake_cost=per_animal_intake_cost,
            per_animal_donation_amount=per_animal_donation_amount,
            intake_notes=intake_notes,
        )
        created_animals.append(animal)
    else:
        # Multi-animal case: expect explicit male / female / unknown counts.
        try:
            male_count = int(payload.get("maleCount") or 0)
        except (TypeError, ValueError):
            male_count = 0
        try:
            female_count = int(payload.get("femaleCount") or 0)
        except (TypeError, ValueError):
            female_count = 0
        try:
            unknown_count = int(payload.get("unknownCount") or 0)
        except (TypeError, ValueError):
            unknown_count = 0

        if male_count + female_count + unknown_count != animal_count:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": [
                            "Invalid multi-animal request. "
                            "maleCount + femaleCount + unknownCount must equal animalCount."
                        ],
                    }
                ),
                400,
            )

        counter = 0

        # Create males.
        for _ in range(male_count):
            counter += 1
            created_animals.append(
                _create_animal_with_milestones(
                    base_name=name,
                    suffix=counter,
                    sex="male",
                    payload=payload,
                    intake_date=intake_date,
                    birth_date=birth_date,
                    is_approx_dob=is_approx_dob,
                    birth_notes=birth_notes,
                    how_acquired=how_acquired,
                    per_animal_intake_cost=per_animal_intake_cost,
                    per_animal_donation_amount=per_animal_donation_amount,
                    intake_notes=intake_notes,
                )
            )

        # Create females.
        for _ in range(female_count):
            counter += 1
            created_animals.append(
                _create_animal_with_milestones(
                    base_name=name,
                    suffix=counter,
                    sex="female",
                    payload=payload,
                    intake_date=intake_date,
                    birth_date=birth_date,
                    is_approx_dob=is_approx_dob,
                    birth_notes=birth_notes,
                    how_acquired=how_acquired,
                    per_animal_intake_cost=per_animal_intake_cost,
                    per_animal_donation_amount=per_animal_donation_amount,
                    intake_notes=intake_notes,
                )
            )

        # Create unknown-sex animals (if any).
        for _ in range(unknown_count):
            counter += 1
            created_animals.append(
                _create_animal_with_milestones(
                    base_name=name,
                    suffix=counter,
                    sex="unknown",
                    payload=payload,
                    intake_date=intake_date,
                    birth_date=birth_date,
                    is_approx_dob=is_approx_dob,
                    birth_notes=birth_notes,
                    how_acquired=how_acquired,
                    per_animal_intake_cost=per_animal_intake_cost,
                    per_animal_donation_amount=per_animal_donation_amount,
                    intake_notes=intake_notes,
                )
            )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal(s) created successfully",
            "data": {"animals": [a.to_dict_basic() for a in created_animals]},
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

