from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal
from ..models.animal_behavior import AnimalBehavior
from ..models.behavior import Behavior


animal_behaviors_bp = Blueprint("animal_behaviors", __name__)


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        from ..models import User
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


@animal_behaviors_bp.post("/upsert-animal-behaviors")
@jwt_required(optional=True)
def upsert_animal_behaviors():
    """Create or update behaviors for one or more animals.

    This is a Flask conversion of the old
    api/animal-behavior/upsert-animal-behaviors endpoint. The payload matches
    the old system format:

        {
          "animalIds": [1, 2, 3],
          "AnimalBehaviorVms": [
            { 
              "id": 1,  // optional, behavior ID
              "behaviorId": 1,  // optional
              "behaviorName": "Aggressive",  // required if behaviorId not provided
              "yesOrNo": true,
              "notes": "..."
            },
            ...
          ]
        }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    behavior_items = payload.get("AnimalBehaviorVms") or payload.get("behaviors") or []

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

    # Get username for entered_by/modified_by fields
    username = ""
    user_id = get_jwt_identity()
    if user_id:
        jwt_data = get_jwt()
        username = jwt_data.get("username") or ""
        if not username:
            from ..models import User
            user = User.query.get(user_id)
            if user:
                username = user.user_name or ""
    
    # Upsert AnimalBehavior rows for each animal / behavior pair.
    for animal in animals:
        for item in behavior_items:
            # Support both old system format (behaviorName) and new format (name)
            behavior_id_from_item = item.get("behaviorId")
            name = (item.get("behaviorName") or item.get("name") or "").strip()
            
            if not name and not behavior_id_from_item:
                continue
            
            yes_or_no = bool(item.get("yesOrNo"))
            notes = (item.get("notes") or "").strip()

            # If behaviorId is provided, use it; otherwise get or create by name
            if behavior_id_from_item:
                behavior = Behavior.query.filter(
                    Behavior.id == behavior_id_from_item,
                    Behavior.is_deleted.is_(False)
                ).first()
                if not behavior:
                    continue
            else:
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
                existing.modified_by = username or "system"
                existing.date_modified = datetime.utcnow()
                existing.is_deleted = False
            else:
                ab = AnimalBehavior(
                    animal_id=animal.id,
                    behavior_id=behavior.id,
                    yes_or_no=yes_or_no,
                    notes=notes,
                    entered_by=username or "system",
                    modified_by=username or "system",
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


@animal_behaviors_bp.get("/get-animal-behaviors")
@jwt_required(optional=True)
def get_animal_behaviors():
    """Get all animal behaviors for a specific animal.
    
    This is a Flask conversion of the old
    api/animal-behavior/get-animal-behaviors endpoint.
    
    Query params:
        - animalId: The animal ID to get behaviors for
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "Animal behaviors retrieved successfully",
        "data": {
            "animalBehaviors": [
                {
                    "id": 1,
                    "behaviorId": 1,
                    "animalId": 1,
                    "yesOrNo": true,
                    "notes": "...",
                    "behaviorName": "Aggressive"
                },
                ...
            ]
        }
    }
    """
    animal_id = request.args.get("animalId", type=int)
    
    if not animal_id or animal_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal identifier required."]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        # Get all animal behaviors for this animal
        animal_behaviors = (
            AnimalBehavior.query
            .join(Behavior, AnimalBehavior.behavior_id == Behavior.id)
            .filter(
                AnimalBehavior.animal_id == animal_id,
                AnimalBehavior.is_deleted.is_(False),
                Behavior.is_deleted.is_(False),
            )
        )
        
        # Filter by tenant if available
        if tenant_id:
            animal_behaviors = animal_behaviors.filter(
                AnimalBehavior.tenant_id == tenant_id
            )
        
        animal_behaviors = animal_behaviors.all()
        
        behaviors_data = [
            {
                "id": ab.id,
                "behaviorId": ab.behavior_id,
                "animalId": ab.animal_id,
                "yesOrNo": ab.yes_or_no,
                "notes": ab.notes or "",
                "behaviorName": ab.behavior.behavior_name if ab.behavior else "",
            }
            for ab in animal_behaviors
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal behaviors retrieved successfully",
            "data": {
                "animalBehaviors": behaviors_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400



