from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Animal

animals_bp = Blueprint("animals", __name__)


@animals_bp.get("/get-animal")
@jwt_required(optional=True)
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
@jwt_required(optional=True)
def create_animal():
    """Very small subset of the original create-animal logic.

    Accepts JSON shaped loosely like the new frontend animal dialog and
    inserts a single Animal row.
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

    animal = Animal(
        animal_name=name,
        breed=(payload.get("breed") or "").strip(),
        color=(payload.get("color") or "").strip(),
        sex=(payload.get("gender") or "").capitalize() or "Unknown",
        status=(payload.get("status") or "available").capitalize(),
        animal_type_name=(payload.get("type") or "").capitalize(),
        chronic_condition=(payload.get("chronicCondition") or "").strip(),
        publicity_blurb=(payload.get("description") or "").strip(),
    )
    db.session.add(animal)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal created successfully",
            "data": animal.to_dict_basic(),
        }
    )


