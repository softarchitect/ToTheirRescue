from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import SAVaccinationType, SAAnimalType, User


sa_vaccination_type_bp = Blueprint("sa_vaccination_type", __name__)


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
            return True  # TODO: Implement actual role check
    return False


@sa_vaccination_type_bp.get("/get-sa-vaccination-type-by-animalId")
@jwt_required()
def get_sa_vaccination_types_by_animal_type_id():
    """Get all Super Admin vaccination types for a specific animal type."""
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
        vaccination_types = (
            SAVaccinationType.query.filter(
                SAVaccinationType.is_deleted.is_(False),
                SAVaccinationType.sa_animal_type_id == animal_type_id,
            )
            .order_by(SAVaccinationType.kind.asc())
            .all()
        )
        
        vaccination_types_data = [
            {
                "id": vt.id,
                "kind": vt.kind,
                "saAnimalTypeId": vt.sa_animal_type_id,
            }
            for vt in vaccination_types
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Vaccination Types retrieved successfully",
            "data": {
                "saVaccinationTypes": vaccination_types_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_vaccination_type_bp.post("/create-sa-vaccination-type")
@jwt_required()
def create_sa_vaccination_type():
    """Create a new Super Admin vaccination type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "").strip() if payload.get("kind") else ""
    sa_animal_type_id = payload.get("saAnimalTypeId")
    
    # Convert to int if it's a string or ensure it's an int
    if isinstance(sa_animal_type_id, str):
        try:
            sa_animal_type_id = int(sa_animal_type_id)
        except (ValueError, TypeError):
            sa_animal_type_id = None
    elif not isinstance(sa_animal_type_id, int):
        sa_animal_type_id = None
    
    if not kind:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Kind is required."]
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
        
        # Check if vaccination type already exists for this animal type
        existing = SAVaccinationType.query.filter(
            SAVaccinationType.is_deleted.is_(False),
            SAVaccinationType.kind == kind,
            SAVaccinationType.sa_animal_type_id == sa_animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Vaccination Type already exists for this animal type.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new SA vaccination type
        new_vaccination_type = SAVaccinationType(
            kind=kind,
            sa_animal_type_id=sa_animal_type_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_vaccination_type)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Vaccination Type created successfully",
            "data": {
                "id": new_vaccination_type.id,
                "kind": new_vaccination_type.kind,
                "saAnimalTypeId": new_vaccination_type.sa_animal_type_id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error creating SA vaccination type: {error_trace}")  # Log for debugging
        return jsonify({
            "success": False,
            "statusCode": 500,
            "errors": [f"Oops! Something went wrong while creating vaccination type: {str(e)}"]
        }), 500


@sa_vaccination_type_bp.post("/update-sa-vaccination-type/<int:vaccination_type_id>")
@jwt_required()
def update_sa_vaccination_type(vaccination_type_id):
    """Update a Super Admin vaccination type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if vaccination_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Vaccination Type ID must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "").strip()
    
    if not kind:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Kind is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        vaccination_type = SAVaccinationType.query.get(vaccination_type_id)
        
        if not vaccination_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        vaccination_type.kind = kind
        vaccination_type.modified_by = username
        vaccination_type.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Vaccination Type updated successfully",
            "data": {
                "id": vaccination_type.id,
                "kind": vaccination_type.kind
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_vaccination_type_bp.patch("/delete-sa-vaccination-type/<int:vaccination_type_id>")
@jwt_required()
def delete_sa_vaccination_type(vaccination_type_id):
    """Soft delete a Super Admin vaccination type."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if vaccination_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Vaccination Type ID must be greater than 0"]
        }), 400
    
    try:
        vaccination_type = SAVaccinationType.query.get(vaccination_type_id)
        
        if not vaccination_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        vaccination_type.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Vaccination Type deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400

