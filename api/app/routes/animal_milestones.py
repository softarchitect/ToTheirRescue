from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal
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




