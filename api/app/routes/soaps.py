from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, SOAP, User


soaps_bp = Blueprint("soaps", __name__)


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


def _soap_to_dict(soap: SOAP) -> dict:
    """Convert SOAP model to dictionary format matching old API response."""
    date = soap.action_date or soap.date_entered or datetime.utcnow()
    return {
        "id": soap.id,
        "animalId": soap.animal_id,
        "actionDate": date.isoformat() if isinstance(date, datetime) else date,
        "subjective": soap.subjective or "",
        "objective": soap.objective or "",
        "assessment": soap.assessment or "",
        "soapPlan": soap.soap_plan or "",
        "hospitalClinicId": soap.hospital_clinic_id or 0,
        "veterinarian": soap.veterinarian or "",
        "dateEntered": soap.date_entered.isoformat() if soap.date_entered else None,
        "dateModified": soap.date_modified.isoformat() if soap.date_modified else None,
        "enteredBy": soap.entered_by or "",
        "modifiedBy": soap.modified_by or "",
        "isDeleted": soap.is_deleted or False,
        "tenantId": soap.tenant_id or 0,
    }


@soaps_bp.post("/add-soap")
@jwt_required(optional=True)
def add_soap_entries():
    """Create SOAP entries for one or more animals.

    Simplified analogue of the old api/soap/add-soap endpoint.

    Expected JSON body:
      {
        "animalIds": [1, 2],
        "actionDate": "2025-01-12",
        "subjective": "...",
        "objective": "...",
        "assessment": "...",
        "plan": "...",
        "veterinarian": "Dr. Smith",
        "hospitalClinicId": 1
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    action_raw = (payload.get("actionDate") or "").strip()
    subjective = (payload.get("subjective") or "").strip()
    objective = (payload.get("objective") or "").strip()
    assessment = (payload.get("assessment") or "").strip()
    plan = (payload.get("plan") or "").strip()
    veterinarian = (payload.get("veterinarian") or "").strip()
    hospital_clinic_id = payload.get("hospitalClinicId") or 1

    if not raw_ids:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal identifiers required"],
                }
            ),
            400,
        )

    if (
        not action_raw
        or not subjective
        or not objective
        or not assessment
        or not plan
        or not veterinarian
    ):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "actionDate, subjective, objective, assessment, plan and veterinarian are required."
                    ],
                }
            ),
            400,
        )

    try:
        animal_ids = [int(aid) for aid in raw_ids]
    except (TypeError, ValueError):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds must be a list of integers."],
                }
            ),
            400,
        )

    try:
        action_date = datetime.fromisoformat(action_raw)
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid actionDate format."],
                }
            ),
            400,
        )

    animals = Animal.query.filter(Animal.id.in_(animal_ids)).all()
    if not animals:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["No matching animals found."],
                }
            ),
            404,
        )

    try:
        hospital_clinic_id_int = int(hospital_clinic_id)
    except (TypeError, ValueError):
        hospital_clinic_id_int = 1

    # Get username from JWT for entered_by field
    username = _get_username_from_jwt()

    created: list[dict] = []
    now = datetime.utcnow()

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        soap = SOAP(
            action_date=action_date,
            subjective=subjective,
            objective=objective,
            assessment=assessment,
            soap_plan=plan,
            veterinarian=veterinarian,
            date_entered=now,
            entered_by=username or "system",
            is_deleted=False,
            animal_id=animal.id,
            tenant_id=tenant_id,
            hospital_clinic_id=hospital_clinic_id_int,
        )

        db.session.add(soap)
        db.session.flush()

        created.append(_soap_to_dict(soap))

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 500,
                    "errors": [f"Failed to create SOAP entries: {str(e)}"],
                }
            ),
            500,
        )

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "SOAP entry added successfully",
            "data": {"items": created},
        }
    )


@soaps_bp.get("/get-soap")
@jwt_required(optional=True)
def get_soap_by_animal_id():
    """Get SOAP entries for a specific animal.
    
    Based on the old system's get-soap endpoint.
    
    Query params:
      - animalId: The animal ID to get SOAPs for
    """
    animal_id = request.args.get("animalId", type=int)
    
    if not animal_id or animal_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal identifier required."]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        # Query with tenant filtering if available
        query = SOAP.query.filter(
            SOAP.animal_id == animal_id,
            SOAP.is_deleted.is_(False),
        )
        if tenant_id:
            query = query.filter(SOAP.tenant_id == tenant_id)
        
        soaps = query.order_by(SOAP.id.asc()).all()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SOAP records retrieved successfully",
            "data": {
                "soaPs": [_soap_to_dict(s) for s in soaps]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting SOAP records: {str(e)}"]
        }), 400


@soaps_bp.get("/by-animal/<int:animal_id>")
@jwt_required(optional=True)
def get_soaps_by_animal(animal_id: int):
    """Return all SOAP entries for a given animal (alternative endpoint)."""

    if animal_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal identifier required."],
                }
            ),
            400,
        )

    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        query = SOAP.query.filter(
            SOAP.animal_id == animal_id,
            SOAP.is_deleted.is_(False),
        )
        if tenant_id:
            query = query.filter(SOAP.tenant_id == tenant_id)
        
        soaps = query.order_by(SOAP.action_date.desc()).all()
        
        items = [_soap_to_dict(soap) for soap in soaps]

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "SOAP entries retrieved successfully",
                "data": {"items": items},
            }
        )
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting SOAP records: {str(e)}"]
        }), 400


@soaps_bp.get("/get-soap-tenant")
@jwt_required()
def get_soap_by_tenant():
    """Get all SOAP entries for the current tenant.
    
    Based on the old system's get-soap-tenant endpoint.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        soaps = (
            SOAP.query.filter(
                SOAP.tenant_id == tenant_id,
                SOAP.is_deleted.is_(False),
            )
            .order_by(SOAP.id.asc())
            .all()
        )
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SOAP records retrieved successfully",
            "data": {
                "soaPs": [_soap_to_dict(s) for s in soaps]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting SOAP records: {str(e)}"]
        }), 400


@soaps_bp.post("/update-soap/<int:soap_id>")
@jwt_required()
def update_soap(soap_id: int):
    """Update a SOAP entry by ID.
    
    Based on the old system's update-soap/{id} endpoint.
    """
    if soap_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["SOAP entry identifier must be greater than 0"]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        soap = SOAP.query.get(soap_id)
        
        if not soap:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["SOAP entry not found"]
            }), 404
        
        # Check if it belongs to the tenant
        if soap.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        payload = request.get_json(silent=True) or {}
        
        # Update fields
        if "actionDate" in payload:
            try:
                date_raw = payload["actionDate"]
                if isinstance(date_raw, str):
                    soap.action_date = datetime.fromisoformat(date_raw.replace("Z", "+00:00"))
            except ValueError:
                return jsonify({
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid date format."]
                }), 400
        
        if "subjective" in payload:
            soap.subjective = (payload["subjective"] or "").strip()
        if "objective" in payload:
            soap.objective = (payload["objective"] or "").strip()
        if "assessment" in payload:
            soap.assessment = (payload["assessment"] or "").strip()
        if "soapPlan" in payload or "plan" in payload:
            soap.soap_plan = (payload.get("soapPlan") or payload.get("plan") or "").strip()
        if "veterinarian" in payload:
            soap.veterinarian = (payload["veterinarian"] or "").strip()
        if "hospitalClinicId" in payload:
            try:
                soap.hospital_clinic_id = int(payload["hospitalClinicId"])
            except (TypeError, ValueError):
                pass
        
        soap.date_modified = datetime.utcnow()
        soap.modified_by = username or "system"
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SOAP updated successfully",
            "data": {
                "soap": _soap_to_dict(soap)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating SOAP entry: {str(e)}"]
        }), 400


@soaps_bp.patch("/delete-soap/<int:soap_id>")
@jwt_required()
def delete_soap(soap_id: int):
    """Soft delete a SOAP entry by ID.
    
    Based on the old system's delete-soap/{id} endpoint.
    """
    if soap_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["SOAP entry identifier must be greater than 0"]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        soap = SOAP.query.get(soap_id)
        
        if not soap:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["SOAP entry not found"]
            }), 404
        
        # Check if it belongs to the tenant
        if soap.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        # Soft delete
        soap.is_deleted = True
        soap.date_modified = datetime.utcnow()
        if username:
            soap.modified_by = username
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SOAP deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting SOAP entry: {str(e)}"]
        }), 400



