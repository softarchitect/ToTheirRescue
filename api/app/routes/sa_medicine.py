from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import SAMedicine, User


sa_medicine_bp = Blueprint("sa_medicine", __name__)


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


@sa_medicine_bp.get("/get-samedicine")
@jwt_required()
def get_sa_medicines():
    """Get all Super Admin medicines."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    try:
        medicines = (
            SAMedicine.query.filter(
                SAMedicine.is_deleted.is_(False),
            )
            .order_by(SAMedicine.medicine_name.asc())
            .all()
        )
        
        medicines_data = [
            {
                "id": m.id,
                "medicineName": m.medicine_name,
                "usedFor": m.used_for,
                "formulation": m.formulation,
                "monthlyMed": m.monthly_med,
                "notes": m.notes,
            }
            for m in medicines
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Medicines retrieved successfully",
            "data": {
                "medicines": medicines_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_medicine_bp.post("/create-samedicine")
@jwt_required()
def create_sa_medicine():
    """Create a new Super Admin medicine."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    payload = request.get_json(silent=True) or {}
    medicine_name = payload.get("medicineName", "").strip()
    used_for = payload.get("usedFor", "").strip()
    formulation = payload.get("formulation", "").strip()
    monthly_med = payload.get("monthlyMed", False)
    notes = payload.get("notes", "").strip()
    
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
    
    if not formulation:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Formulation is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        # Check if medicine already exists
        existing = SAMedicine.query.filter(
            SAMedicine.is_deleted.is_(False),
            SAMedicine.medicine_name == medicine_name
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Medicine already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new SA medicine
        new_medicine = SAMedicine(
            medicine_name=medicine_name,
            used_for=used_for,
            formulation=formulation,
            monthly_med=monthly_med,
            notes=notes,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_medicine)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Medicine created successfully",
            "data": {
                "id": new_medicine.id,
                "medicineName": new_medicine.medicine_name,
                "usedFor": new_medicine.used_for,
                "formulation": new_medicine.formulation,
                "monthlyMed": new_medicine.monthly_med,
                "notes": new_medicine.notes,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_medicine_bp.post("/update-samedicine/<int:medicine_id>")
@jwt_required()
def update_sa_medicine(medicine_id):
    """Update a Super Admin medicine."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if medicine_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Medicine ID must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    medicine_name = payload.get("medicineName", "").strip()
    used_for = payload.get("usedFor", "").strip()
    formulation = payload.get("formulation", "").strip()
    monthly_med = payload.get("monthlyMed", False)
    notes = payload.get("notes", "").strip()
    
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
    
    if not formulation:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Formulation is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        medicine = SAMedicine.query.get(medicine_id)
        
        if not medicine:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        medicine.medicine_name = medicine_name
        medicine.used_for = used_for
        medicine.formulation = formulation
        medicine.monthly_med = monthly_med
        medicine.notes = notes
        medicine.modified_by = username
        medicine.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Medicine updated successfully",
            "data": {
                "id": medicine.id,
                "medicineName": medicine.medicine_name,
                "usedFor": medicine.used_for,
                "formulation": medicine.formulation,
                "monthlyMed": medicine.monthly_med,
                "notes": medicine.notes,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_medicine_bp.patch("/delete-samedicine/<int:medicine_id>")
@jwt_required()
def delete_sa_medicine(medicine_id):
    """Soft delete a Super Admin medicine."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if medicine_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Medicine ID must be greater than 0"]
        }), 400
    
    try:
        medicine = SAMedicine.query.get(medicine_id)
        
        if not medicine:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        medicine.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Medicine deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400

