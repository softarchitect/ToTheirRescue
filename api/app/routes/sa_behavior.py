from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import SABehavior, SAAnimalType, User


sa_behavior_bp = Blueprint("sa_behavior", __name__)


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "")


def _check_super_admin():
    """Check if user is Super Administrator."""
    claims = get_jwt()
    role_name = (claims.get("role") or claims.get("roleName") or "").strip()
    if role_name == "SuperAdministrator":
        return True

    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user:
            return True  # TODO: Implement actual role check
    return False


@sa_behavior_bp.get("/get-sa-behavior-by-animalId")
@jwt_required()
def get_sa_behaviors_by_animal_type_id():
    """Get all Super Admin behaviors for a specific animal type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    animal_type_id = request.args.get("animalTypeId", type=int)
    
    if not animal_type_id or animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["SA Animal Type ID is required and must be greater than 0"]
        }), 400
    
    try:
        behaviors = (
            SABehavior.query.filter(
                SABehavior.is_deleted.is_(False),
                SABehavior.sa_animal_type_id == animal_type_id,
            )
            .order_by(SABehavior.behavior_name.asc())
            .all()
        )
        
        behaviors_data = [
            {
                "id": b.id,
                "behaviorName": b.behavior_name,
                "saAnimalTypeId": b.sa_animal_type_id,
            }
            for b in behaviors
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Behaviors retrieved successfully",
            "data": {
                "saBehaviors": behaviors_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_behavior_bp.post("/create-sa-behavior")
@jwt_required()
def create_sa_behavior():
    """Create a new Super Admin behavior."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    try:
        payload = request.get_json(silent=True) or {}
        behavior_name = payload.get("behaviorName", "").strip() if payload.get("behaviorName") else ""
        sa_animal_type_id = payload.get("saAnimalTypeId")
        
        if isinstance(sa_animal_type_id, str):
            try:
                sa_animal_type_id = int(sa_animal_type_id)
            except (ValueError, TypeError):
                sa_animal_type_id = None
        elif not isinstance(sa_animal_type_id, int):
            sa_animal_type_id = None
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Invalid request payload: {str(e)}"]
        }), 400
    
    if not behavior_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior Name is required."]
        }), 400
    
    if not sa_animal_type_id or sa_animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["SA Animal Type ID is required and must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        # Check if SA animal type exists
        sa_animal_type = SAAnimalType.query.get(sa_animal_type_id)
        if not sa_animal_type or sa_animal_type.is_deleted:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["SA Animal Type not found."]
            }), 400
        
        # Check if behavior already exists for this animal type
        existing = SABehavior.query.filter(
            SABehavior.is_deleted.is_(False),
            SABehavior.behavior_name == behavior_name,
            SABehavior.sa_animal_type_id == sa_animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Behavior already exists for this animal type.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new SA behavior
        new_behavior = SABehavior(
            behavior_name=behavior_name,
            sa_animal_type_id=sa_animal_type_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_behavior)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Behavior created successfully",
            "data": {
                "id": new_behavior.id,
                "behaviorName": new_behavior.behavior_name,
                "saAnimalTypeId": new_behavior.sa_animal_type_id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error creating SA behavior: {error_trace}")  # Log for debugging
        return jsonify({
            "success": False,
            "statusCode": 500,
            "errors": [f"Oops! Something went wrong while creating behavior: {str(e)}"]
        }), 500


@sa_behavior_bp.post("/update-sa-behavior/<int:behavior_id>")
@jwt_required()
def update_sa_behavior(behavior_id):
    """Update a Super Admin behavior."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if behavior_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior ID must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    behavior_name = payload.get("behaviorName", "").strip()
    
    if not behavior_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior Name is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        behavior = SABehavior.query.get(behavior_id)
        
        if not behavior:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        behavior.behavior_name = behavior_name
        behavior.modified_by = username
        behavior.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Behavior updated successfully",
            "data": {
                "id": behavior.id,
                "behaviorName": behavior.behavior_name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_behavior_bp.patch("/delete-sa-behavior/<int:behavior_id>")
@jwt_required()
def delete_sa_behavior(behavior_id):
    """Soft delete a Super Admin behavior."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if behavior_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior ID must be greater than 0"]
        }), 400
    
    try:
        behavior = SABehavior.query.get(behavior_id)
        
        if not behavior:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        behavior.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Behavior deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400

