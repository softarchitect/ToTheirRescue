from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Diary, Animal, User


diary_bp = Blueprint("diary", __name__)


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


def _diary_to_dict(diary: Diary) -> dict:
    """Convert Diary model to dictionary format matching old API response."""
    return {
        "id": diary.id,
        "animalId": diary.animal_id,
        "tenantOrAnimal": diary.tenant_or_animal or "",
        "actionDate": diary.action_date.isoformat() if diary.action_date else None,
        "notes": diary.notes or "",
        "dateEntered": diary.date_entered.isoformat() if diary.date_entered else None,
        "dateModified": diary.date_modified.isoformat() if diary.date_modified else None,
        "enteredBy": diary.entered_by or "",
        "modifiedBy": diary.modified_by or "",
        "isDeleted": diary.is_deleted or False,
        "tenantId": diary.tenant_id or 0,
        "animal": diary.animal or "",
    }


@diary_bp.get("/get-diary")
@jwt_required()
def get_diary_by_animal_id():
    """Get diary entries for a specific animal.
    
    Based on the old system's get-diary endpoint.
    
    Query params:
      - animalId: The animal ID to get diaries for
    """
    animal_id = request.args.get("animalId", type=int)
    
    if not animal_id or animal_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Animal identifier required."]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        diaries = (
            Diary.query.filter(
                Diary.animal_id == animal_id,
                Diary.tenant_or_animal == "animal",
                Diary.is_deleted.is_(False),
                Diary.tenant_id == tenant_id,
            )
            .order_by(Diary.id.asc())
            .all()
        )
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Diary entry records retrieved successfully",
            "data": {
                "diaries": [_diary_to_dict(d) for d in diaries]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting diary entry records: {str(e)}"]
        }), 400


@diary_bp.get("/get-diary-tenant")
@jwt_required()
def get_diary_by_tenant():
    """Get all diary entries for the current tenant.
    
    Based on the old system's get-diary-tenant endpoint.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        diaries = (
            Diary.query.filter(
                Diary.tenant_id == tenant_id,
                Diary.tenant_or_animal == "tenant",
                Diary.is_deleted.is_(False),
            )
            .order_by(Diary.action_date.desc())
            .all()
        )
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Diary entries retrieved successfully",
            "data": {
                "diaries": [_diary_to_dict(d) for d in diaries]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something wrong getting diary entries: {str(e)}"]
        }), 400


@diary_bp.post("/add-diary")
@jwt_required()
def add_diary():
    """Create a diary entry for animals or tenant.
    
    Supports both animal and tenant diary entries.
    Based on the old system's add-diary endpoint.
    
    Expected JSON body:
      For animals:
      {
        "animalIds": [1, 2],
        "date": "2025-01-12",
        "notes": "string"
      }
      
      For tenant:
      {
        "animalIds": [0],
        "entityType": "tenant",
        "diaryVm": {
          "actionDate": "2025-01-12",
          "notes": "string"
        }
      }
    """
    payload = request.get_json(silent=True) or {}
    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    # Check if this is a tenant diary entry
    entity_type = (payload.get("entityType") or "").strip().lower()
    diary_vm = payload.get("diaryVm") or {}
    
    if entity_type == "tenant" or (payload.get("animalIds") == [0] and diary_vm):
        # Tenant diary entry
        action_date_raw = diary_vm.get("actionDate") or payload.get("date") or ""
        notes = (diary_vm.get("notes") or payload.get("notes") or "").strip()
        
        if not action_date_raw or not notes:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["actionDate and notes are required."]
            }), 400
        
        try:
            # Handle dayjs format or ISO format
            if isinstance(action_date_raw, str):
                action_date = datetime.fromisoformat(action_date_raw.replace("Z", "+00:00"))
            else:
                action_date = datetime.utcnow()
        except ValueError:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Invalid date format."]
            }), 400
        
        entry = Diary(
            animal_id=0,
            tenant_or_animal="tenant",
            action_date=action_date,
            notes=notes,
            date_entered=datetime.utcnow(),
            entered_by=username or "system",
            is_deleted=False,
            tenant_id=tenant_id,
            animal="",
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Diary entry added successfully",
            "data": {
                "diaries": [_diary_to_dict(entry)]
            }
        }), 200
    
    # Animal diary entry (existing logic)
    raw_ids = payload.get("animalIds") or []
    date_raw = (payload.get("date") or "").strip()
    notes = (payload.get("notes") or "").strip()

    if not raw_ids or not date_raw or not notes:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds, date, and notes are required."],
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
        action_date = datetime.fromisoformat(date_raw)
    except ValueError:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid date format."],
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

    created = []
    now = datetime.utcnow()
    for animal in animals:
        entry = Diary(
            animal_id=animal.id,
            tenant_or_animal="animal",
            action_date=action_date,
            notes=notes,
            date_entered=now,
            entered_by=username or "system",
            tenant_id=animal.tenant_id or 0,
            animal=animal.animal_name or "",
            is_deleted=False,
        )
        db.session.add(entry)
        created.append(entry)

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Diary entry added successfully",
            "data": {
                "diaries": [_diary_to_dict(d) for d in created]
            },
        }
    )


@diary_bp.post("/update-diary/<int:diary_id>")
@jwt_required()
def update_diary(diary_id: int):
    """Update a diary entry by ID.
    
    Based on the old system's update-diary/{id} endpoint.
    """
    if diary_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Diary entry identifier must be greater than 0"]
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
        diary = Diary.query.get(diary_id)
        
        if not diary:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["Diary entry not found"]
            }), 404
        
        # Check if it belongs to the tenant
        if diary.tenant_id != tenant_id:
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
                    diary.action_date = datetime.fromisoformat(date_raw.replace("Z", "+00:00"))
            except ValueError:
                return jsonify({
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid date format."]
                }), 400
        
        if "notes" in payload:
            diary.notes = (payload["notes"] or "").strip()
        
        diary.date_modified = datetime.utcnow()
        diary.modified_by = username or "system"
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Diary entry updated successfully",
            "data": {
                "diary": _diary_to_dict(diary)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating diary entry: {str(e)}"]
        }), 400


@diary_bp.patch("/delete-diary/<int:diary_id>")
@jwt_required()
def delete_diary(diary_id: int):
    """Soft delete a diary entry by ID.
    
    Based on the old system's delete-diary/{id} endpoint.
    """
    if diary_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Diary entry identifier must be greater than 0"]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        diary = Diary.query.get(diary_id)
        
        if not diary:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["Diary entry not found"]
            }), 404
        
        # Check if it belongs to the tenant
        if diary.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        # Get username from JWT for modified_by field
        username = _get_username_from_jwt()
        
        # Soft delete
        diary.is_deleted = True
        diary.date_modified = datetime.utcnow()
        if username:
            diary.modified_by = username
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Diary entry deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting diary entry: {str(e)}"]
        }), 400

