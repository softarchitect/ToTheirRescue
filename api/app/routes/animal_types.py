from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import AnimalType, User


animal_types_bp = Blueprint("animal_types", __name__)


@animal_types_bp.get("/get-animal-types")
@jwt_required(optional=True)
def get_animal_types():
    """Port of the old api/animaltype/get-animal-types endpoint.

    Query params:
      - roleName: if 'SuperAdministrator', returns SA-level animal types
                  (RoleName == 'SuperAdministrator', IsDeleted == false).
                  Otherwise returns tenant-scoped animal types for the
                  currently authenticated user.
    """
    role_name = request.args.get("roleName", type=str) or ""
    role_name_normalized = role_name.strip()

    user_id = get_jwt_identity()

    tenant_id = None
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            tenant_id = user.tenant_id

    try:
        query = AnimalType.query.filter(AnimalType.is_deleted.is_(False))

        # Match the old C# logic:
        # if roleName is SuperAdministrator -> filter by RoleName only
        # else -> filter by tenant id
        if (
            role_name_normalized
            and role_name_normalized.lower() == "superadministrator"
        ):
            query = query.filter(
                db.func.lower(AnimalType.role_name)
                == role_name_normalized.lower()
            )
        else:
            # For non-SA roles we need a tenant; if we don't have one,
            # return an empty list with a 200 like the old API would
            # when FindAllAsync returns no rows.
            if tenant_id is not None:
                query = query.filter(AnimalType.tenant_id == tenant_id)
            else:
                animal_types = []
                return jsonify(
                    {
                        "success": True,
                        "statusCode": 200,
                        "message": "Animal Types retrieved successfully",
                        "data": {"animalTypes": animal_types},
                    }
                )

        animal_types = [a.to_dict_basic() for a in query.order_by(AnimalType.type_name.asc()).all()]

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Animal Types retrieved successfully",
                "data": {"animalTypes": animal_types},
            }
        )
    except Exception:
        # Generic error wrapper similar to the old repository code
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "Oops! Something went wrong while getting animal record"
                    ],
                }
            ),
            400,
        )



