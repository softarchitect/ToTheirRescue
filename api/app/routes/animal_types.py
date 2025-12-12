from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import AnimalType, User


animal_types_bp = Blueprint("animal_types", __name__)


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "")


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


@animal_types_bp.post("/create-animal-type")
@jwt_required()
def create_animal_type():
    """Port of the old api/animaltype/create-animal-type endpoint.
    
    Request body:
        {
            "typeName": "Dogs",
            "roleName": "User" (optional)
        }
    """
    payload = request.get_json(silent=True) or {}
    type_name = payload.get("typeName", "").strip()
    role_name = payload.get("roleName", "").strip()
    
    if not type_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type Name is required."]
        }), 400
    
    user_id = get_jwt_identity()
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        # Check if animal type is available
        role_name_normalized = role_name.lower() if role_name else ""
        is_super_admin = role_name_normalized == "superadministrator"
        
        if is_super_admin:
            existing = AnimalType.query.filter(
                AnimalType.is_deleted.is_(False),
                AnimalType.type_name == type_name,
                db.func.lower(AnimalType.role_name) == "superadministrator"
            ).first()
        else:
            existing = AnimalType.query.filter(
                AnimalType.is_deleted.is_(False),
                AnimalType.type_name == type_name,
                AnimalType.tenant_id == tenant_id
            ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Animal Type already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new animal type
        new_animal_type = AnimalType(
            type_name=type_name,
            tenant_id=tenant_id,
            role_name=role_name if role_name else None,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_animal_type)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal Type created successfully",
            "data": {
                "id": new_animal_type.id,
                "typeName": new_animal_type.type_name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while adding record: {str(e)}"]
        }), 400


@animal_types_bp.post("/update-animal-type/<int:animal_type_id>")
@jwt_required()
def update_animal_type(animal_type_id):
    """Port of the old api/animaltype/update-animal-type/{id} endpoint.
    
    Request body:
        {
            "typeName": "Dogs",
            "roleName": "User" (optional)
        }
    """
    if animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    type_name = payload.get("typeName", "").strip()
    
    if not type_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type Name is required."]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        animal_type = AnimalType.query.get(animal_type_id)
        
        if not animal_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": animal_type_id},
                "errors": ["No record found"]
            }), 400
        
        # Update the animal type
        animal_type.type_name = type_name
        animal_type.modified_by = username
        animal_type.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal Type updated successfully",
            "data": {
                "id": animal_type.id,
                "animalType": animal_type.to_dict_basic()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating record: {str(e)}"]
        }), 400


@animal_types_bp.patch("/delete-animal-type/<int:animal_type_id>")
@jwt_required()
def delete_animal_type(animal_type_id):
    """Port of the old api/animaltype/delete-animal-type/{id} endpoint.
    
    Soft deletes an animal type by setting is_deleted to True.
    """
    if animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Identifier must be greater than 0"]
        }), 400
    
    try:
        animal_type = AnimalType.query.get(animal_type_id)
        
        if not animal_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        animal_type.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal Type deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@animal_types_bp.get("/available-animal-type")
@jwt_required()
def available_animal_type():
    """Port of the old api/animaltype/available-animal-type endpoint.
    
    Query params:
        - typeName: The animal type name to check
        - roleName: The role name (optional, defaults to user's role)
    
    Returns whether the animal type name is available.
    """
    type_name = request.args.get("typeName", type=str) or ""
    role_name = request.args.get("roleName", type=str) or ""
    
    if not type_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type Name is required."]
        }), 400
    
    if not role_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Role Name is required."]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        role_name_normalized = role_name.strip().lower()
        is_super_admin = role_name_normalized == "superadministrator"
        
        if is_super_admin:
            existing = AnimalType.query.filter(
                AnimalType.is_deleted.is_(False),
                AnimalType.type_name == type_name,
                db.func.lower(AnimalType.role_name) == "superadministrator"
            ).first()
        else:
            existing = AnimalType.query.filter(
                AnimalType.is_deleted.is_(False),
                AnimalType.type_name == type_name,
                AnimalType.tenant_id == tenant_id
            ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Animal Type already exists.",
                "data": {"isAvailable": False}
            }), 200
        else:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Animal Type available",
                "data": {"isAvailable": True}
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while checking available record: {str(e)}"]
        }), 400

