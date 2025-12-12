from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import Medicine, User


medicines_bp = Blueprint("medicines", __name__)


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


@medicines_bp.get("/get-medicine")
@jwt_required(optional=True)
def get_medicines():
    """Port of the old api/medicine/get-medicine endpoint.
    
    Returns all active medicines for the current tenant.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        medicines = (
            Medicine.query.filter(
                Medicine.is_deleted.is_(False),
                Medicine.tenant_id == tenant_id,
            )
            .order_by(Medicine.medicine_name.asc())
            .all()
        )
        
        medicines_data = [
            {
                "id": m.id,
                "medicineName": m.medicine_name,
                "usedFor": m.used_for,
            }
            for m in medicines
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Medicine retrieved successfully",
            "data": {
                "medicines": medicines_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@medicines_bp.post("/create-medicine")
@jwt_required()
def create_medicine():
    """Port of the old api/medicine/create-medicine endpoint.
    
    Request body:
        {
            "medicineName": "Aspirin",
            "usedFor": "Pain relief"
        }
    """
    payload = request.get_json(silent=True) or {}
    medicine_name = payload.get("medicineName", "").strip()
    used_for = payload.get("usedFor", "").strip()
    
    if not medicine_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Medicine Name is required."]
        }), 400
    
    if not used_for:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Used For is required."]
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
        # Check if medicine already exists (case-sensitive, tenant-scoped)
        existing = Medicine.query.filter(
            Medicine.is_deleted.is_(False),
            Medicine.medicine_name == medicine_name,
            Medicine.tenant_id == tenant_id
        ).first()
        
        if existing:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Medicine already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new medicine
        # Note: formulation is required in the model, so we set a default empty string
        new_medicine = Medicine(
            medicine_name=medicine_name,
            used_for=used_for,
            formulation="",  # Required field, set to empty string
            monthly_med=False,
            tenant_id=tenant_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_medicine)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Medicine added successfully",
            "data": {
                "id": new_medicine.id,
                "medicineName": new_medicine.medicine_name,
                "usedFor": new_medicine.used_for,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while adding record: {str(e)}"]
        }), 400


@medicines_bp.post("/update-medicine/<int:medicine_id>")
@jwt_required()
def update_medicine(medicine_id):
    """Port of the old api/medicine/update-medicine/{id} endpoint.
    
    Request body:
        {
            "medicineName": "Aspirin",
            "usedFor": "Pain relief"
        }
    """
    if medicine_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Medicine Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    medicine_name = payload.get("medicineName", "").strip()
    used_for = payload.get("usedFor", "").strip()
    
    if not medicine_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid Medicine request."]
        }), 400
    
    if not used_for:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Used For is required."]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        medicine = Medicine.query.get(medicine_id)
        
        if not medicine:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": medicine_id},
                "errors": ["No record found"]
            }), 400
        
        # Check if it belongs to the tenant
        if medicine.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        # Check for duplicate name (excluding the current item)
        existing_duplicate = Medicine.query.filter(
            Medicine.id != medicine_id,
            Medicine.is_deleted.is_(False),
            Medicine.medicine_name == medicine_name,
            Medicine.tenant_id == tenant_id
        ).first()
        
        if existing_duplicate:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Medicine with this name already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Update the medicine
        medicine.medicine_name = medicine_name
        medicine.used_for = used_for
        medicine.modified_by = username
        medicine.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Medicine updated successfully",
            "data": {
                "id": medicine.id,
                "medicine": {
                    "id": medicine.id,
                    "medicineName": medicine.medicine_name,
                    "usedFor": medicine.used_for,
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


@medicines_bp.patch("/delete-medicine/<int:medicine_id>")
@jwt_required()
def delete_medicine(medicine_id):
    """Port of the old api/medicine/delete-medicine/{id} endpoint.
    
    Soft deletes a medicine by setting is_deleted to True.
    """
    if medicine_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Medicine Identifier must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        medicine = Medicine.query.get(medicine_id)
        
        if not medicine:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        # Check if it belongs to the tenant
        if medicine.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        medicine.is_deleted = True
        medicine.modified_by = username
        medicine.date_modified = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Medicine deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@medicines_bp.get("/available-medicine")
@jwt_required()
def available_medicine():
    """Port of the old api/medicine/available-medicine endpoint.
    
    Query params:
        - medicineName: The medicine name to check
    
    Returns whether the medicine name is available.
    """
    medicine_name = request.args.get("medicineName", type=str) or ""
    
    if not medicine_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Medicine is required."]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        existing = Medicine.query.filter(
            Medicine.is_deleted.is_(False),
            Medicine.medicine_name == medicine_name,
            Medicine.tenant_id == tenant_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Medicine already exists.",
                "data": {"isAvailable": False}
            }), 200
        else:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Medicine available",
                "data": {"isAvailable": True}
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while checking available record: {str(e)}"]
        }), 400

