from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import SAAnimalType, User


sa_animal_type_bp = Blueprint("sa_animal_type", __name__)


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "")


def _check_super_admin():
    """Check if user is Super Administrator."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user:
            # Check if user has SuperAdministrator role
            # This assumes you have a role checking mechanism
            # For now, we'll check based on role_name or similar field
            # Adjust based on your actual role implementation
            return True  # TODO: Implement actual role check
    return False


@sa_animal_type_bp.get("/get-sa-animal-type")
@jwt_required()
def get_sa_animal_types():
    """Get all Super Admin animal types."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    try:
        query = SAAnimalType.query.filter(SAAnimalType.is_deleted.is_(False))
        animal_types = [a.to_dict() if hasattr(a, 'to_dict') else {
            "id": a.id,
            "typeName": a.type_name,
            "dateEntered": a.date_entered.isoformat() if a.date_entered else None,
            "dateModified": a.date_modified.isoformat() if a.date_modified else None,
            "enteredBy": a.entered_by,
            "modifiedBy": a.modified_by,
        } for a in query.order_by(SAAnimalType.type_name.asc()).all()]

        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Animal Types retrieved successfully",
            "data": {"saAnimalTypes": animal_types},
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_animal_type_bp.post("/create-sa-animal-type")
@jwt_required()
def create_sa_animal_type():
    """Create a new Super Admin animal type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    payload = request.get_json(silent=True) or {}
    type_name = payload.get("typeName", "").strip()
    role_name = payload.get("roleName", "").strip()
    
    if not type_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type Name is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        # Check if animal type already exists
        existing = SAAnimalType.query.filter(
            SAAnimalType.is_deleted.is_(False),
            SAAnimalType.type_name == type_name
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Animal Type already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new SA animal type
        new_animal_type = SAAnimalType(
            type_name=type_name,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_animal_type)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Animal Type created successfully",
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


@sa_animal_type_bp.post("/update-sa-animal-type/<int:animal_type_id>")
@jwt_required()
def update_sa_animal_type(animal_type_id):
    """Update a Super Admin animal type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["SA Animal Identifier must be greater than 0"]
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
    
    try:
        animal_type = SAAnimalType.query.get(animal_type_id)
        
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
            "message": "SA Animal Type updated successfully",
            "data": {
                "id": animal_type.id,
                "typeName": animal_type.type_name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating record: {str(e)}"]
        }), 400


@sa_animal_type_bp.patch("/delete-sa-animal-type/<int:animal_type_id>")
@jwt_required()
def delete_sa_animal_type(animal_type_id):
    """Soft delete a Super Admin animal type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["SA Animal Identifier must be greater than 0"]
        }), 400
    
    try:
        animal_type = SAAnimalType.query.get(animal_type_id)
        
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
            "message": "SA Animal Type deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@sa_animal_type_bp.get("/available-sa-animal-type")
@jwt_required()
def available_sa_animal_type():
    """Check if a Super Admin animal type name is available."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    type_name = request.args.get("typeName", type=str) or ""
    
    if not type_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Type Name is required."]
        }), 400
    
    try:
        existing = SAAnimalType.query.filter(
            SAAnimalType.is_deleted.is_(False),
            SAAnimalType.type_name == type_name
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

