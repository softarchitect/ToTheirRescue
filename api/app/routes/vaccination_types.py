from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import VaccinationType, User


vaccination_types_bp = Blueprint("vaccination_types", __name__)


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


@vaccination_types_bp.get("/get-vaccination-type-by-animalId")
@jwt_required(optional=True)
def get_vaccination_types_by_animal_type_id():
    """Port of the old api/vaccination-type/get-vaccination-type-by-animalId endpoint.
    
    Query params:
        - animalTypeId: The animal type ID to filter vaccination types by
    
    Returns all active vaccination types for the specified animal type.
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
        vaccination_types = (
            VaccinationType.query.filter(
                VaccinationType.is_deleted.is_(False),
                VaccinationType.animal_type_id == animal_type_id,
                VaccinationType.tenant_id == tenant_id,
            )
            .order_by(VaccinationType.kind.asc())
            .all()
        )
        
        vaccination_types_data = [
            {
                "id": vt.id,
                "kind": vt.kind,
                "animalTypeId": vt.animal_type_id,
            }
            for vt in vaccination_types
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Vaccination Type retrieved successfully",
            "data": {
                "vaccinationTypes": vaccination_types_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@vaccination_types_bp.post("/create-vaccination-type")
@jwt_required()
def create_vaccination_type():
    """Port of the old api/vaccination-type/create-vaccination-type endpoint.
    
    Request body:
        {
            "kind": "Rabies",
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
            "errors": ["Vaccination Type is required."]
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
        # Check if vaccination type already exists
        existing = VaccinationType.query.filter(
            VaccinationType.is_deleted.is_(False),
            VaccinationType.kind == kind,
            VaccinationType.tenant_id == tenant_id,
            VaccinationType.animal_type_id == animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Vaccination Type already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new vaccination type
        new_vaccination_type = VaccinationType(
            kind=kind,
            animal_type_id=animal_type_id,
            tenant_id=tenant_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_vaccination_type)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Vaccination Type added successfully",
            "data": {
                "id": new_vaccination_type.id,
                "kind": new_vaccination_type.kind,
                "animalTypeId": new_vaccination_type.animal_type_id,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while adding record: {str(e)}"]
        }), 400


@vaccination_types_bp.post("/update-vaccination-type/<int:vaccination_type_id>")
@jwt_required()
def update_vaccination_type(vaccination_type_id):
    """Port of the old api/vaccination-type/update-vaccination-type/{id} endpoint.
    
    Request body:
        {
            "kind": "Rabies",
            "animalTypeId": 1
        }
    """
    if vaccination_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Vaccination Type Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "").strip()
    animal_type_id = payload.get("animalTypeId")
    
    if not kind:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid Vaccination Type request."]
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
        vaccination_type = VaccinationType.query.get(vaccination_type_id)
        
        if not vaccination_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": vaccination_type_id},
                "errors": ["No record found"]
            }), 400
        
        # Check if it belongs to the tenant
        if vaccination_type.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        # Update the vaccination type
        vaccination_type.kind = kind
        vaccination_type.animal_type_id = animal_type_id
        vaccination_type.modified_by = username
        vaccination_type.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Vaccination Type updated successfully",
            "data": {
                "id": vaccination_type.id,
                "vaccinationType": {
                    "id": vaccination_type.id,
                    "kind": vaccination_type.kind,
                    "animalTypeId": vaccination_type.animal_type_id,
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


@vaccination_types_bp.patch("/delete-vaccination-type/<int:vaccination_type_id>")
@jwt_required()
def delete_vaccination_type(vaccination_type_id):
    """Port of the old api/vaccination-type/delete-vaccination-type/{id} endpoint.
    
    Soft deletes a vaccination type by setting is_deleted to True.
    """
    if vaccination_type_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Vaccination Type Identifier must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        vaccination_type = VaccinationType.query.get(vaccination_type_id)
        
        if not vaccination_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Vaccination Type not found"]
            }), 400
        
        # Check if it belongs to the tenant
        if vaccination_type.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        vaccination_type.is_deleted = True
        vaccination_type.modified_by = username
        vaccination_type.date_modified = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Vaccination Type deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@vaccination_types_bp.get("/available-vaccination-type")
@jwt_required()
def available_vaccination_type():
    """Port of the old api/vaccination-type/available-vaccination-type endpoint.
    
    Query params:
        - vaccinationType: The vaccination type name to check
        - animaltypeId: The animal type ID
    
    Returns whether the vaccination type name is available.
    """
    vaccination_type = request.args.get("vaccinationType", type=str) or ""
    animal_type_id = request.args.get("animaltypeId", type=int) or request.args.get("animalTypeId", type=int)
    
    if not vaccination_type:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Vaccination Type is required."]
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
        existing = VaccinationType.query.filter(
            VaccinationType.is_deleted.is_(False),
            VaccinationType.kind == vaccination_type,
            VaccinationType.tenant_id == tenant_id,
            VaccinationType.animal_type_id == animal_type_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Vaccination Type already exists.",
                "data": {"isAvailable": False}
            }), 200
        else:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Vaccination Type available",
                "data": {"isAvailable": True}
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while checking available record: {str(e)}"]
        }), 400

