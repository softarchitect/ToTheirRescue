from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import Behavior, User


behaviors_bp = Blueprint("behaviors", __name__)


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


@behaviors_bp.get("/get-animal-behavior-by-animalId")
@behaviors_bp.get("/get-behaviors-by-animalId")
@jwt_required(optional=True)
def get_behaviors_by_animal_type_id():
    """Port of the old api/behavior/get-behaviors-by-animalId endpoint.
    
    Query params:
        - animalTypeId: The animal type ID to filter behaviors by
    
    Returns all active behaviors for the specified animal type.
    """
    # Handle OPTIONS request for CORS preflight
    if request.method == "OPTIONS":
        return "", 200
    
    animal_type_id = request.args.get("animalTypeId", type=int)
    
    if not animal_type_id or animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type ID is required and must be greater than 0"]
        }), 400
    
    try:
        # Old system doesn't filter by tenant_id for this endpoint
        # It only filters by isDeleted and animalTypeId
        behaviors = (
            Behavior.query.filter(
                Behavior.is_deleted.is_(False),
                Behavior.animal_type_id == animal_type_id,
            )
            .order_by(Behavior.behavior_name.asc())
            .all()
        )
        
        behaviors_data = [
            {
                "id": b.id,
                "kind": b.behavior_name,
                "behaviorName": b.behavior_name,
                "animalTypeId": b.animal_type_id,
            }
            for b in behaviors
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Behavior retrieved successfully",
            "data": {
                "behaviors": behaviors_data,
                "animalBehaviors": behaviors_data,  # Support both field names
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@behaviors_bp.post("/create-animal-behavior")
@behaviors_bp.post("/create-behavior")
@jwt_required()
def create_behavior():
    """Port of the old api/behavior/create-behavior endpoint.
    
    Request body:
        {
            "behaviorName": "Aggressive",
            "animalTypeId": 1
        }
        OR
        {
            "kind": "Aggressive",
            "animalTypeId": 1
        }
    """
    payload = request.get_json(silent=True) or {}
    behavior_name = payload.get("behaviorName") or payload.get("kind", "").strip()
    animal_type_id = payload.get("animalTypeId")
    
    if not behavior_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior Name is required."]
        }), 400
    
    if not animal_type_id or animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type ID is required and must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        # Check if behavior already exists
        existing = Behavior.query.filter(
            Behavior.is_deleted.is_(False),
            Behavior.behavior_name == behavior_name,
            Behavior.tenant_id == tenant_id,
            Behavior.animal_type_id == animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Behavior already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new behavior
        new_behavior = Behavior(
            behavior_name=behavior_name,
            animal_type_id=animal_type_id,
            tenant_id=tenant_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_behavior)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Behavior added successfully",
            "data": {
                "id": new_behavior.id,
                "kind": new_behavior.behavior_name,
                "behaviorName": new_behavior.behavior_name,
                "animalTypeId": new_behavior.animal_type_id,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while adding behavior record: {str(e)}"]
        }), 400


@behaviors_bp.post("/update-behavior/<int:behavior_id>")
@jwt_required()
def update_behavior(behavior_id):
    """Port of the old api/behavior/update-behavior/{id} endpoint.
    
    Request body:
        {
            "behaviorName": "Aggressive",
            "animalTypeId": 1
        }
    """
    if behavior_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    behavior_name = payload.get("behaviorName") or payload.get("kind", "").strip()
    animal_type_id = payload.get("animalTypeId")
    
    if not behavior_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid behavior request."]
        }), 400
    
    if not animal_type_id or animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type ID is required and must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        behavior = Behavior.query.get(behavior_id)
        
        if not behavior:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": behavior_id},
                "errors": ["No record found"]
            }), 400
        
        # Check if it belongs to the tenant
        if behavior.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        # Update the behavior
        behavior.behavior_name = behavior_name
        behavior.animal_type_id = animal_type_id
        behavior.modified_by = username
        behavior.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Behavior updated successfully",
            "data": {
                "id": behavior.id,
                "behavior": {
                    "id": behavior.id,
                    "behaviorName": behavior.behavior_name,
                    "animalTypeId": behavior.animal_type_id,
                }
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating record: {str(e)}"]
        }), 400


@behaviors_bp.patch("/delete-behavior/<int:behavior_id>")
@jwt_required()
def delete_behavior(behavior_id):
    """Port of the old api/behavior/delete-behavior/{id} endpoint.
    
    Soft deletes a behavior by setting is_deleted to True.
    """
    if behavior_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior Identifier must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        behavior = Behavior.query.get(behavior_id)
        
        if not behavior:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Behavior not found"]
            }), 400
        
        # Check if it belongs to the tenant
        if behavior.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        behavior.is_deleted = True
        behavior.modified_by = username
        behavior.date_modified = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Behavior deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@behaviors_bp.get("/available-behavior")
@jwt_required()
def available_behavior():
    """Port of the old api/behavior/available-behavior endpoint.
    
    Query params:
        - behaviorName: The behavior name to check
        - animaltypeId: The animal type ID
    
    Returns whether the behavior name is available.
    """
    behavior_name = request.args.get("behaviorName", type=str) or ""
    animal_type_id = request.args.get("animaltypeId", type=int) or request.args.get("animalTypeId", type=int)
    
    if not behavior_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Behavior Name is required."]
        }), 400
    
    if not animal_type_id or animal_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal Type ID is required and must be greater than 0"]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        existing = Behavior.query.filter(
            Behavior.is_deleted.is_(False),
            Behavior.behavior_name == behavior_name,
            Behavior.tenant_id == tenant_id,
            Behavior.animal_type_id == animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Behavior already exists.",
                "data": {"isAvailable": False}
            }), 200
        else:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Behavior available",
                "data": {"isAvailable": True}
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while checking available record: {str(e)}"]
        }), 400

