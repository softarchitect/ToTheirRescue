from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

from ..extensions import db
from ..models import Region, Country, AspNetRole, AspNetUserRole


regions_bp = Blueprint("regions", __name__)


def _get_username_from_jwt() -> str:
    claims = get_jwt()
    return (claims.get("username") or "").strip()


def _has_admin_access() -> bool:
    user_id = get_jwt_identity()
    if not user_id:
        return False

    user_roles = (
        db.session.query(AspNetRole.name)
        .join(AspNetUserRole, AspNetRole.id == AspNetUserRole.role_id)
        .filter(AspNetUserRole.user_id == user_id)
        .all()
    )
    # Keep compatibility with existing auth behavior:
    # when no explicit role mapping exists, user is treated as Administrator.
    if not user_roles:
        return True

    role_names = {(role_name or "").strip().lower() for (role_name,) in user_roles}
    return "administrator" in role_names or "superadministrator" in role_names


@regions_bp.get("/get-region")
def get_regions():
    country_id = request.args.get("countryId", type=int)

    query = Region.query.filter(Region.is_deleted.is_(False))
    if country_id:
        query = query.filter(Region.country_id == country_id)

    regions = [region.to_dict() for region in query.order_by(Region.region_name.asc()).all()]
    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Regions retrieved successfully",
            "data": {"regions": regions},
        }
    )


@regions_bp.post("/create-region")
@jwt_required()
def create_region():
    if not _has_admin_access():
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 403,
                    "errors": ["Access denied. Administrator role required."],
                }
            ),
            403,
        )

    payload = request.get_json(silent=True) or {}
    country_id = payload.get("countryId")
    region_name = (payload.get("regionName") or "").strip()
    region_code = (payload.get("regionCode") or "").strip().upper() or None

    if not country_id or int(country_id) <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country is required."],
                }
            ),
            400,
        )

    if not region_name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Region name is required."],
                }
            ),
            400,
        )

    country = Country.query.get(int(country_id))
    if not country:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Country not found."],
                }
            ),
            404,
        )

    duplicate = Region.query.filter(
        Region.is_deleted.is_(False),
        Region.country_id == int(country_id),
        db.func.lower(Region.region_name) == region_name.lower(),
    ).first()
    if duplicate:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Region already exists for this country."],
                }
            ),
            400,
        )

    try:
        username = _get_username_from_jwt()
        region = Region(
            country_id=int(country_id),
            region_name=region_name,
            region_code=region_code,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False,
        )
        db.session.add(region)
        db.session.commit()
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Region created successfully",
                "data": {"region": region.to_dict()},
            }
        )
    except Exception as exc:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Oops! Something went wrong while adding record: {exc}"],
                }
            ),
            400,
        )


@regions_bp.post("/update-region/<int:id>")
@jwt_required()
def update_region(id: int):
    if id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Region identifier should be greater than 0"],
                }
            ),
            400,
        )

    if not _has_admin_access():
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 403,
                    "errors": ["Access denied. Administrator role required."],
                }
            ),
            403,
        )

    payload = request.get_json(silent=True) or {}
    country_id = payload.get("countryId")
    region_name = (payload.get("regionName") or "").strip()
    region_code = (payload.get("regionCode") or "").strip().upper() or None

    if not country_id or int(country_id) <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country is required."],
                }
            ),
            400,
        )
    if not region_name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Region name is required."],
                }
            ),
            400,
        )

    region = Region.query.get(id)
    if not region or region.is_deleted:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Region not found."],
                }
            ),
            404,
        )

    duplicate = Region.query.filter(
        Region.is_deleted.is_(False),
        Region.country_id == int(country_id),
        db.func.lower(Region.region_name) == region_name.lower(),
        Region.id != id,
    ).first()
    if duplicate:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Region already exists for this country."],
                }
            ),
            400,
        )

    try:
        username = _get_username_from_jwt()
        region.country_id = int(country_id)
        region.region_name = region_name
        region.region_code = region_code
        region.modified_by = username
        region.date_modified = datetime.utcnow()
        db.session.commit()
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Region updated successfully",
                "data": {"region": region.to_dict()},
            }
        )
    except Exception as exc:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Oops! Something went wrong while updating record: {exc}"],
                }
            ),
            400,
        )


@regions_bp.patch("/delete-region/<int:id>")
@jwt_required()
def delete_region(id: int):
    if id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Region identifier should be greater than 0"],
                }
            ),
            400,
        )

    if not _has_admin_access():
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 403,
                    "errors": ["Access denied. Administrator role required."],
                }
            ),
            403,
        )

    region = Region.query.get(id)
    if not region or region.is_deleted:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Region not found."],
                }
            ),
            404,
        )

    try:
        region.is_deleted = True
        db.session.commit()
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Region deleted successfully",
                "data": {"isDeleted": True},
            }
        )
    except Exception as exc:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [f"Oops! Something went wrong while deleting record: {exc}"],
                }
            ),
            400,
        )
