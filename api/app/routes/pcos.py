from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import PCO

pcos_bp = Blueprint("pcos", __name__)


@pcos_bp.get("/get-pco")
@jwt_required(optional=True)
def get_pcos():
    """Rough equivalent of GET api/PCO/get-pco.

    For now we ignore tenant filters and entityType and just support:
      - searchText: matches first/last name or email
      - page / limit pagination
    """
    search_text = request.args.get("searchText", "", type=str)
    page = request.args.get("Page", request.args.get("page", 1, type=int), type=int)
    limit = request.args.get("Limit", request.args.get("limit", 20, type=int), type=int)

    query = PCO.query.filter(PCO.is_deleted.is_(False))

    if search_text:
        pattern = f"%{search_text.lower()}%"
        query = query.filter(
            db.or_(
                db.func.lower(PCO.last_name).like(pattern),
                db.func.lower(PCO.first_name).like(pattern),
                db.func.lower(PCO.email).like(pattern),
            )
        )

    total_items = query.count()
    items = (
        query.order_by(PCO.last_name.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    data = [p.to_dict_basic() for p in items]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "PCOs retrieved successfully",
            "data": {
                "currentPage": page,
                "totalItems": total_items,
                "totalPage": (total_items + limit - 1) // limit if limit else 1,
                "pcos": data,
            },
        }
    )


@pcos_bp.post("/create-pco")
@jwt_required(optional=True)
def create_pco():
    """Simplified creation of a PCO (person/company/organization)."""
    payload = request.get_json(silent=True) or {}

    last_name = (payload.get("lastName") or "").strip()
    first_name = (payload.get("firstName") or "").strip()
    if not last_name and not first_name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["At least firstName or lastName is required."],
                }
            ),
            400,
        )

    pco = PCO(
        last_name=last_name or first_name,
        first_name=first_name,
        street=(payload.get("street") or "").strip(),
        city=(payload.get("city") or "").strip(),
        state=(payload.get("state") or "").strip(),
        zip=(payload.get("zip") or "").strip(),
        phone=(payload.get("phone") or "").strip(),
        email=(payload.get("email") or "").strip(),
        entity_type=(payload.get("entityType") or "Person")[:10],
    )
    db.session.add(pco)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "PCO created successfully",
            "data": pco.to_dict_basic(),
        }
    )


