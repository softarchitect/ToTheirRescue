from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Animal
from ..models.animal_behavior import AnimalBehavior
from ..models.behavior import Behavior


animal_behaviors_bp = Blueprint("animal_behaviors", __name__)


@animal_behaviors_bp.post("/upsert-animal-behaviors")
def upsert_animal_behaviors():
    """Create or update behaviors for one or more animals.

    This is a simplified version of the old
    api/animal-behavior/upsert-animal-behaviors endpoint. The payload is:

        {
          "animalIds": [1, 2, 3],
          "behaviors": [
            { "name": "Aggressive", "yesOrNo": true, "notes": "..." },
            ...
          ]
        }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    behavior_items = payload.get("behaviors") or []

    if not raw_ids or not behavior_items:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds and behaviors are both required."],
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

    # Assume all selected animals are of the same type (the UI enforces this).
    # Fall back to 0 if the type is missing.
    base_animal = animals[0]
    animal_type_id = base_animal.animal_type_id or 0
    tenant_id = base_animal.tenant_id or 0

    # Cache Behavior rows by lowercased name to avoid duplicate lookups.
    behavior_cache: dict[str, Behavior] = {}

    def get_or_create_behavior(name: str) -> Behavior:
        key = name.lower()
        if key in behavior_cache:
            return behavior_cache[key]

        existing = (
            Behavior.query.filter(
                Behavior.animal_type_id == animal_type_id,
                Behavior.tenant_id == tenant_id,
                db.func.lower(Behavior.behavior_name) == key,
                Behavior.is_deleted.is_(False),
            )
            .order_by(Behavior.id.asc())
            .first()
        )
        if existing:
            behavior_cache[key] = existing
            return existing

        created = Behavior(
            animal_type_id=animal_type_id,
            tenant_id=tenant_id,
            behavior_name=name,
            date_entered=datetime.utcnow(),
            is_deleted=False,
        )
        db.session.add(created)
        db.session.flush()  # assign id
        behavior_cache[key] = created
        return created

    # Upsert AnimalBehavior rows for each animal / behavior pair.
    for animal in animals:
        for item in behavior_items:
            name = (item.get("name") or "").strip()
            if not name:
                continue
            yes_or_no = bool(item.get("yesOrNo"))
            notes = (item.get("notes") or "").strip()

            behavior = get_or_create_behavior(name)

            existing = (
                AnimalBehavior.query.filter(
                    AnimalBehavior.animal_id == animal.id,
                    AnimalBehavior.behavior_id == behavior.id,
                    AnimalBehavior.tenant_id == tenant_id,
                )
                .order_by(AnimalBehavior.id.asc())
                .first()
            )

            if existing:
                existing.yes_or_no = yes_or_no
                existing.notes = notes
                existing.modified_by = "system"
                existing.date_modified = datetime.utcnow()
                existing.is_deleted = False
            else:
                ab = AnimalBehavior(
                    animal_id=animal.id,
                    behavior_id=behavior.id,
                    yes_or_no=yes_or_no,
                    notes=notes,
                    entered_by="system",
                    modified_by="system",
                    tenant_id=tenant_id,
                    is_deleted=False,
                )
                db.session.add(ab)

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal behaviors updated successfully",
        }
    )



