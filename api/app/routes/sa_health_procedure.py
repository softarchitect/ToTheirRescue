from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import SAHealthProcedure, SAAnimalType, User


sa_health_procedure_bp = Blueprint("sa_health_procedure", __name__)


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


@sa_health_procedure_bp.get("/get-sa-health-procedure-by-animalId")
@jwt_required()
def get_sa_health_procedures_by_animal_type_id():
    """Get all Super Admin health procedures for a specific animal type."""
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
        health_procedures = (
            SAHealthProcedure.query.filter(
                SAHealthProcedure.is_deleted.is_(False),
                SAHealthProcedure.sa_animal_type_id == animal_type_id,
            )
            .order_by(SAHealthProcedure.kind.asc())
            .all()
        )
        
        health_procedures_data = [
            {
                "id": hp.id,
                "kind": hp.kind,
                "saAnimalTypeId": hp.sa_animal_type_id,
            }
            for hp in health_procedures
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Health Procedures retrieved successfully",
            "data": {
                "saHealthProcedures": health_procedures_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_health_procedure_bp.post("/create-sa-health-procedure")
@jwt_required()
def create_sa_health_procedure():
    """Create a new Super Admin health procedure."""
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
        
        # Check if health procedure already exists for this animal type
        existing = SAHealthProcedure.query.filter(
            SAHealthProcedure.is_deleted.is_(False),
            SAHealthProcedure.kind == kind,
            SAHealthProcedure.sa_animal_type_id == sa_animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Health Procedure already exists for this animal type.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new SA health procedure
        new_procedure = SAHealthProcedure(
            kind=kind,
            sa_animal_type_id=sa_animal_type_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_procedure)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Health Procedure created successfully",
            "data": {
                "id": new_procedure.id,
                "kind": new_procedure.kind,
                "saAnimalTypeId": new_procedure.sa_animal_type_id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error creating SA health procedure: {error_trace}")  # Log for debugging
        return jsonify({
            "success": False,
            "statusCode": 500,
            "errors": [f"Oops! Something went wrong while creating health procedure: {str(e)}"]
        }), 500


@sa_health_procedure_bp.post("/update-sa-health-procedure/<int:procedure_id>")
@jwt_required()
def update_sa_health_procedure(procedure_id):
    """Update a Super Admin health procedure."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if procedure_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Procedure ID must be greater than 0"]
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
        procedure = SAHealthProcedure.query.get(procedure_id)
        
        if not procedure:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        procedure.kind = kind
        procedure.modified_by = username
        procedure.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Health Procedure updated successfully",
            "data": {
                "id": procedure.id,
                "kind": procedure.kind
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_health_procedure_bp.patch("/delete-sa-health-procedure/<int:procedure_id>")
@jwt_required()
def delete_sa_health_procedure(procedure_id):
    """Soft delete a Super Admin health procedure."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if procedure_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Procedure ID must be greater than 0"]
        }), 400
    
    try:
        procedure = SAHealthProcedure.query.get(procedure_id)
        
        if not procedure:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        procedure.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Health Procedure deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400

