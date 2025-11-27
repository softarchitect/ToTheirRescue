from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models import Country


countries_bp = Blueprint("countries", __name__)


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



