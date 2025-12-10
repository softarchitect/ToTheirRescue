from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, PCO
from ..models.animal_milestone import AnimalMilestone


animal_milestones_bp = Blueprint("animal_milestones", __name__)


@animal_milestones_bp.get("/by-animal/<int:animal_id>")
def get_milestones_by_animal(animal_id: int):
    """Return all non-deleted milestones for a single animal.

    This is a simplified read-only version of the old
    api/animal-milestone/get-animal-milestone-animalid endpoint.
    """
    if animal_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal identifier must be greater than 0"],
                }
            ),
            400,
        )

    items = (
        AnimalMilestone.query.filter(
            AnimalMilestone.animal_id == animal_id,
            AnimalMilestone.is_deleted.is_(False),
        )
        .order_by(AnimalMilestone.milestone_date.asc())
        .all()
    )

    milestones = [
        {
            "id": str(m.id),
            "animalId": str(m.animal_id),
            "type": m.milestone_type,
            "date": m.milestone_date.date().isoformat(),
            "firstName": None,
            "lastName": None,
            "notes": m.notes or "",
        }
        for m in items
    ]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal milestones retrieved successfully",
            "data": {"milestones": milestones},
        }
    )


@animal_milestones_bp.post("/add-by-animals")
def add_milestones_for_animals():
    """Create the same milestone for one or more animals.

    This is a simplified analogue of the old
    api/animal-milestone/add-animal-milestone-by-animalIds endpoint.
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    milestone_type = (payload.get("milestoneType") or "").strip()
    date_raw = (payload.get("date") or "").strip()
    notes = (payload.get("notes") or "").strip() or None
    pco_id_raw = payload.get("pcoId")

    if not raw_ids or not milestone_type or not date_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "animalIds, milestoneType, and date are all required."
                    ],
                }
            ),
            400,
        )

    try:
        milestone_date = datetime.fromisoformat(date_raw)
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid milestone date format."],
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

    created: list[dict] = []
    for animal in animals:
        tenant_id = animal.tenant_id or 0
        pco_id = int(pco_id_raw) if pco_id_raw not in (None, "", 0) else 0

        milestone = AnimalMilestone(
            milestone_type=milestone_type,
            milestone_date=milestone_date,
            other_rescue_id_no="",
            amount_paid_fee=0,
            amount_received_fee=0,
            notes=notes,
            acquisition_way_id=0,
            pco_id=pco_id,
            animal_id=animal.id,
            tenant_id=tenant_id,
            acquisition_way_name="",
            other_rescue_shelter_id=0,
            is_approx_dob=False,
        )
        db.session.add(milestone)

        # Update summary fields on the animal, as in the old system.
        animal.last_milestone = milestone_type
        animal.last_milestone_date = milestone_date

        created.append(
            {
                "id": None,  # Filled after flush
                "animalId": str(animal.id),
                "type": milestone_type,
                "date": milestone_date.date().isoformat(),
                "notes": notes or "",
            }
        )

    db.session.flush()

    # Back-fill generated ids.
    for i, m in enumerate(
        AnimalMilestone.query.filter(
            AnimalMilestone.animal_id.in_(animal_ids),
            AnimalMilestone.milestone_date == milestone_date,
            AnimalMilestone.milestone_type == milestone_type,
        ).all()
    ):
        if i < len(created):
            created[i]["id"] = str(m.id)

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Milestones added successfully",
            "data": {"milestones": created},
        }
    )


@animal_milestones_bp.post("/update-animal-milestone/<int:id>")
@jwt_required(optional=True)
def update_animal_milestone(id: int):
    """Update an existing animal milestone.

    This is a Flask conversion of the old
    api/animal-milestone/update-animal-milestone/{id} endpoint.

    Request body fields (all optional except those marked):
      - milestoneType: string (required)
      - milestoneDate: ISO datetime string (required)
      - isApproxDOB: boolean
      - otherRescueIDNo: string
      - amountPaidFee: decimal
      - amountReceivedFee: decimal
      - notes: string
      - acquisitionWayId: integer
      - acquisitionWayName: string
      - pcoId: integer
      - otherRescueShelterId: integer

    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "Animal milestone updated successfully",
        "data": {
            "id": 1,
            "animalMilestone": { ... }
        }
    }
    """
    if id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal milestone identifier is required"],
                }
            ),
            400,
        )

    payload = request.get_json(silent=True) or {}

    # Get username for modified_by field
    user_id = get_jwt_identity()
    username = ""
    if user_id:
        jwt_data = get_jwt()
        username = jwt_data.get("username") or ""
        if not username:
            from ..models import User
            user = User.query.get(user_id)
            if user:
                username = user.user_name or ""

    # Get existing milestone
    milestone = AnimalMilestone.query.get(id)
    if not milestone:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["No record found"],
                    "data": {"id": id},
                }
            ),
            400,
        )

    # Extract and validate required fields
    milestone_type = (payload.get("milestoneType") or "").strip()
    date_raw = (payload.get("milestoneDate") or "").strip()

    if not milestone_type or not date_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["milestoneType and milestoneDate are required"],
                }
            ),
            400,
        )

    try:
        # Handle both date-only (YYYY-MM-DD) and datetime strings
        if "T" in date_raw or " " in date_raw:
            # Full datetime string
            date_raw = date_raw.replace("Z", "+00:00")
            milestone_date = datetime.fromisoformat(date_raw)
        else:
            # Date-only string (YYYY-MM-DD), set to midnight UTC
            milestone_date = datetime.fromisoformat(date_raw + "T00:00:00")
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid milestone date format. Expected YYYY-MM-DD or ISO datetime."],
                }
            ),
            400,
        )

    # Update milestone fields
    milestone.milestone_type = milestone_type
    milestone.milestone_date = milestone_date
    milestone.is_approx_dob = payload.get("isApproxDOB", False)
    milestone.other_rescue_id_no = (payload.get("otherRescueIDNo") or "").strip() or ""
    milestone.amount_paid_fee = payload.get("amountPaidFee") or 0
    milestone.amount_received_fee = payload.get("amountReceivedFee") or 0
    milestone.notes = (payload.get("notes") or "").strip() or None
    milestone.date_modified = datetime.utcnow()
    milestone.is_deleted = False
    milestone.modified_by = username
    milestone.acquisition_way_name = (payload.get("acquisitionWayName") or "").strip() or ""
    milestone.acquisition_way_id = payload.get("acquisitionWayId") or 0

    # Handle PCO ID: if 0 or null, set to 1; otherwise use the provided value
    pco_id_raw = payload.get("pcoId")
    if pco_id_raw in (None, 0, ""):
        milestone.pco_id = 1
    else:
        milestone.pco_id = int(pco_id_raw)

    # Handle OtherRescueShelterId: if > 0, use it; otherwise set to 0
    other_rescue_shelter_id = payload.get("otherRescueShelterId")
    if other_rescue_shelter_id and int(other_rescue_shelter_id) > 0:
        milestone.other_rescue_shelter_id = int(other_rescue_shelter_id)
    else:
        milestone.other_rescue_shelter_id = 0

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Failed to update milestone: {str(e)}"],
                }
            ),
            400,
        )

    # Get the last milestone for this animal (ordered by DateEntered desc)
    last_milestone = (
        AnimalMilestone.query.filter(
            AnimalMilestone.animal_id == milestone.animal_id,
            AnimalMilestone.is_deleted.is_(False),
        )
        .order_by(AnimalMilestone.date_entered.desc())
        .first()
    )

    # Update the animal's last milestone and location
    animal = Animal.query.get(milestone.animal_id)
    if animal:
        # Update PCO ID if milestone has a valid PCO (> 1)
        if milestone.pco_id and milestone.pco_id > 1:
            animal.pco_id = milestone.pco_id

            # Get PCO to build location string
            pco = PCO.query.get(milestone.pco_id)
            if pco:
                person_name = ""
                if pco.last_name:
                    person_name = pco.last_name
                    if pco.first_name:
                        person_name = f"{pco.last_name}, {pco.first_name}"
                elif pco.first_name:
                    person_name = pco.first_name
                animal.location = person_name

        # Update last milestone info
        if last_milestone:
            animal.last_milestone = last_milestone.milestone_type
            animal.last_milestone_date = last_milestone.milestone_date

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            # Log error but don't fail the milestone update
            pass

    # Return updated milestone
    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal milestone updated successfully",
            "data": {
                "id": milestone.id,
                "animalMilestone": {
                    "id": milestone.id,
                    "animalId": milestone.animal_id,
                    "milestoneType": milestone.milestone_type,
                    "milestoneDate": milestone.milestone_date.isoformat(),
                    "isApproxDOB": milestone.is_approx_dob,
                    "otherRescueIDNo": milestone.other_rescue_id_no,
                    "amountPaidFee": float(milestone.amount_paid_fee) if milestone.amount_paid_fee else 0,
                    "amountReceivedFee": float(milestone.amount_received_fee) if milestone.amount_received_fee else 0,
                    "notes": milestone.notes or "",
                    "acquisitionWayId": milestone.acquisition_way_id,
                    "acquisitionWayName": milestone.acquisition_way_name,
                    "pcoId": milestone.pco_id,
                    "otherRescueShelterId": milestone.other_rescue_shelter_id,
                },
            },
        }
    )




