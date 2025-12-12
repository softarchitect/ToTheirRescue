from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import HealthProcedure, User


health_procedures_bp = Blueprint("health_procedures", __name__)


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


@health_procedures_bp.get("/get-health-procedure-by-animalId")
@jwt_required(optional=True)
def get_health_procedures_by_animal_type_id():
    """Port of the old api/health-procedure/get-health-procedure-by-animalId endpoint.
    
    Query params:
        - animalTypeId: The animal type ID to filter health procedures by
    
    Returns all active health procedures for the specified animal type.
    """
    animal_type_id = request.args.get("animalTypeId", type=int)
    
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
        health_procedures = (
            HealthProcedure.query.filter(
                HealthProcedure.is_deleted.is_(False),
                HealthProcedure.animal_type_id == animal_type_id,
                HealthProcedure.tenant_id == tenant_id,
            )
            .order_by(HealthProcedure.kind.asc())
            .all()
        )
        
        health_procedures_data = [
            {
                "id": hp.id,
                "kind": hp.kind,
                "animalTypeId": hp.animal_type_id,
            }
            for hp in health_procedures
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Health Procedure retrieved successfully",
            "data": {
                "healthProcedures": health_procedures_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@health_procedures_bp.post("/create-health-procedure")
@jwt_required()
def create_health_procedure():
    """Port of the old api/health-procedure/create-health-procedure endpoint.
    
    Request body:
        {
            "kind": "Spay/Neuter",
            "animalTypeId": 1
        }
    """
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "").strip()
    animal_type_id = payload.get("animalTypeId")
    
    if not kind:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Health Procedure is required."]
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
        # Check if health procedure already exists
        existing = HealthProcedure.query.filter(
            HealthProcedure.is_deleted.is_(False),
            HealthProcedure.kind == kind,
            HealthProcedure.tenant_id == tenant_id,
            HealthProcedure.animal_type_id == animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Health Procedure already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new health procedure
        new_health_procedure = HealthProcedure(
            kind=kind,
            animal_type_id=animal_type_id,
            tenant_id=tenant_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_health_procedure)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Health Procedure added successfully",
            "data": {
                "id": new_health_procedure.id,
                "kind": new_health_procedure.kind,
                "animalTypeId": new_health_procedure.animal_type_id,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while adding record: {str(e)}"]
        }), 400


@health_procedures_bp.post("/update-health-procedure/<int:health_procedure_id>")
@jwt_required()
def update_health_procedure(health_procedure_id):
    """Port of the old api/health-procedure/update-health-procedure/{id} endpoint.
    
    Request body:
        {
            "kind": "Spay/Neuter",
            "animalTypeId": 1
        }
    """
    if health_procedure_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Health Procedure Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "").strip()
    animal_type_id = payload.get("animalTypeId")
    
    if not kind:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid Health Procedure request."]
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
        health_procedure = HealthProcedure.query.get(health_procedure_id)
        
        if not health_procedure:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": health_procedure_id},
                "errors": ["No record found"]
            }), 400
        
        # Check if it belongs to the tenant
        if health_procedure.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        # Update the health procedure
        health_procedure.kind = kind
        health_procedure.animal_type_id = animal_type_id
        health_procedure.modified_by = username
        health_procedure.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Health Procedure updated successfully",
            "data": {
                "id": health_procedure.id,
                "healthProcedure": {
                    "id": health_procedure.id,
                    "kind": health_procedure.kind,
                    "animalTypeId": health_procedure.animal_type_id,
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


@health_procedures_bp.patch("/delete-health-procedure/<int:health_procedure_id>")
@jwt_required()
def delete_health_procedure(health_procedure_id):
    """Port of the old api/health-procedure/delete-health-procedure/{id} endpoint.
    
    Soft deletes a health procedure by setting is_deleted to True.
    """
    if health_procedure_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Health Procedure Identifier must be greater than 0"]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        health_procedure = HealthProcedure.query.get(health_procedure_id)
        
        if not health_procedure:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Health Procedure not found"]
            }), 400
        
        # Check if it belongs to the tenant
        if health_procedure.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        health_procedure.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Health Procedure deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@health_procedures_bp.get("/available-health-procedure")
@jwt_required()
def available_health_procedure():
    """Port of the old api/health-procedure/available-health-procedure endpoint.
    
    Query params:
        - healthProcedure: The health procedure name to check
        - animaltypeId: The animal type ID
    
    Returns whether the health procedure name is available.
    """
    health_procedure = request.args.get("healthProcedure", type=str) or ""
    animal_type_id = request.args.get("animaltypeId", type=int) or request.args.get("animalTypeId", type=int)
    
    if not health_procedure:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Health Procedure is required."]
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
        existing = HealthProcedure.query.filter(
            HealthProcedure.is_deleted.is_(False),
            HealthProcedure.kind == health_procedure,
            HealthProcedure.tenant_id == tenant_id,
            HealthProcedure.animal_type_id == animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Health Procedure already exists.",
                "data": {"isAvailable": False}
            }), 200
        else:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Health Procedure available",
                "data": {"isAvailable": True}
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while checking available record: {str(e)}"]
        }), 400

