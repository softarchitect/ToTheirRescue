from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import Country, Tenant, PCO, AspNetRole, AspNetUserRole


countries_bp = Blueprint("countries", __name__)


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


@countries_bp.get("/get-country")
def get_countries():
    """Rough equivalent of GET api/country/get-country.

    Returns all countries ordered by name. This is primarily intended for
    dropdowns in the registration and profile flows.
    """
    items = Country.query.order_by(Country.country_name.asc()).all()
    data = [c.to_dict_basic() for c in items]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Countries retrieved successfully",
            "data": {
                "countries": data,
            },
        }
    )


@countries_bp.get("/get-country/<int:id>")
def get_country_by_id(id: int):
    """Rough equivalent of GET api/country/get-country/{id}."""
    if id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country identifier should be greater than 0"],
                }
            ),
            400,
        )

    country: Country | None = Country.query.get(id)
    if not country:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Country not found"],
                }
            ),
            404,
        )

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Country retrieved successfully",
            "data": {
                "country": country.to_dict_basic(),
            },
        }
    )


@countries_bp.post("/create-country")
@jwt_required()
def create_country():
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
    country_name = (payload.get("countryName") or payload.get("name") or "").strip()
    iso2_code = (payload.get("iso2Code") or payload.get("isO2Code") or "").strip().upper() or None
    isd_code = payload.get("isdCode")
    currency_abbreviation = (payload.get("currencyAbbreviation") or "").strip().upper() or None
    date_format = (payload.get("dateFormat") or "").strip() or None

    if not country_name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country name is required."],
                }
            ),
            400,
        )

    duplicate = Country.query.filter(db.func.lower(Country.country_name) == country_name.lower()).first()
    if duplicate:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country already exists."],
                }
            ),
            400,
        )

    try:
        country = Country(
            country_name=country_name,
            iso2_code=iso2_code,
            isd_code=isd_code if isd_code is not None else None,
            currency_abbreviation=currency_abbreviation,
            date_format=date_format,
            date_entered=datetime.utcnow(),
        )
        db.session.add(country)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Country created successfully",
                "data": {"country": country.to_dict_basic()},
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


@countries_bp.post("/update-country/<int:id>")
@jwt_required()
def update_country(id: int):
    if id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country identifier should be greater than 0"],
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
    country_name = (payload.get("countryName") or payload.get("name") or "").strip()
    iso2_code = (payload.get("iso2Code") or payload.get("isO2Code") or "").strip().upper() or None
    isd_code = payload.get("isdCode")
    currency_abbreviation = (payload.get("currencyAbbreviation") or "").strip().upper() or None
    date_format = (payload.get("dateFormat") or "").strip() or None

    if not country_name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country name is required."],
                }
            ),
            400,
        )

    country = Country.query.get(id)
    if not country:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Country not found"],
                }
            ),
            404,
        )

    duplicate = Country.query.filter(
        db.func.lower(Country.country_name) == country_name.lower(),
        Country.id != id,
    ).first()
    if duplicate:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country already exists."],
                }
            ),
            400,
        )

    try:
        country.country_name = country_name
        country.iso2_code = iso2_code
        country.isd_code = isd_code if isd_code is not None else None
        country.currency_abbreviation = currency_abbreviation
        country.date_format = date_format
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Country updated successfully",
                "data": {"country": country.to_dict_basic()},
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


@countries_bp.patch("/delete-country/<int:id>")
@jwt_required()
def delete_country(id: int):
    if id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country identifier should be greater than 0"],
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

    country = Country.query.get(id)
    if not country:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Country not found"],
                }
            ),
            404,
        )

    linked_tenant = Tenant.query.filter(Tenant.country_id == id).first()
    linked_pco = PCO.query.filter(PCO.country_id == id).first()
    if linked_tenant or linked_pco:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Country is in use and cannot be deleted."],
                }
            ),
            400,
        )

    try:
        db.session.delete(country)
        db.session.commit()
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Country deleted successfully",
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



