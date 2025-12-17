from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Volunteer, PCO, User, VolunteerPersonActivity, VolunteerActivity


volunteers_bp = Blueprint("volunteers", __name__)


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


def _volunteer_to_dict(volunteer: Volunteer, pco: PCO = None) -> dict:
    """Convert Volunteer model to dictionary format."""
    return {
        "id": volunteer.id,
        "pcoId": volunteer.pco_id,
        "firstName": pco.first_name if pco else "",
        "lastName": pco.last_name if pco else "",
        "phone": pco.phone if pco else "",
        "email": pco.email if pco else "",
        "notes": volunteer.notes or "",
        "active": volunteer.active,
        "status": "Active" if volunteer.active else "Inactive",
        "dateActive": volunteer.date_active.isoformat() if volunteer.date_active else None,
        "dateInactive": volunteer.date_inactive.isoformat() if volunteer.date_inactive else None,
        "dateEntered": volunteer.date_entered.isoformat() if volunteer.date_entered else None,
        "dateModified": volunteer.date_modified.isoformat() if volunteer.date_modified else None,
    }


@volunteers_bp.get("/get-volunteers")
@jwt_required(optional=True)
def get_volunteers():
    """Get volunteers by PCO ID or by status.
    
    Query params:
        - pcoId: Get volunteer for a specific PCO (optional)
        - status: 'true' for active, 'false' for inactive (optional, defaults to all)
    """
    tenant_id = _get_tenant_id_from_jwt()
    pco_id = request.args.get("pcoId", type=int)
    status = request.args.get("status", type=str)
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        if pco_id:
            # Get volunteer for specific PCO
            volunteer = Volunteer.query.filter(
                Volunteer.pco_id == pco_id,
                Volunteer.tenant_id == tenant_id,
                Volunteer.is_deleted.is_(False)
            ).first()
            
            if not volunteer:
                return jsonify({
                    "success": True,
                    "statusCode": 200,
                    "message": "No volunteer found for this PCO",
                    "data": {
                        "volunteerPersonCustom": None
                    }
                }), 200
            
            # Get volunteer activities
            activities = VolunteerPersonActivity.query.filter(
                VolunteerPersonActivity.pco_id == pco_id,
                VolunteerPersonActivity.tenant_id == tenant_id,
                VolunteerPersonActivity.is_deleted.is_(False)
            ).all()
            
            # Get activity names
            activity_customs = []
            for activity in activities:
                va = VolunteerActivity.query.get(activity.volunteer_activity_id)
                if va:
                    activity_customs.append({
                        "volunteerActivityId": va.id,
                        "volunteerActivityName": va.volunteer_activity_name,
                        "pcoId": pco_id,
                        "tenantId": tenant_id
                    })
            
            pco = PCO.query.get(pco_id)
            volunteer_data = {
                "id": volunteer.id,
                "pcoId": volunteer.pco_id,
                "notes": volunteer.notes or "",
                "active": volunteer.active,
                "dateActive": volunteer.date_active.isoformat() if volunteer.date_active else None,
                "dateInactive": volunteer.date_inactive.isoformat() if volunteer.date_inactive else None,
                "volunteerActivityCustoms": activity_customs
            }
            
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Volunteer retrieved successfully",
                "data": {
                    "volunteerPersonCustom": volunteer_data
                }
            }), 200
        else:
            # Get volunteers by status (existing functionality)
            is_active = status and status.lower() == "true"
            
            if status:
                if is_active:
                    volunteers = (
                        Volunteer.query.filter(
                            Volunteer.tenant_id == tenant_id,
                            Volunteer.active.is_(True),
                            Volunteer.is_deleted.is_(False),
                        )
                        .order_by(Volunteer.date_active.desc() if Volunteer.date_active else Volunteer.date_entered.desc())
                        .all()
                    )
                else:
                    volunteers = (
                        Volunteer.query.filter(
                            Volunteer.tenant_id == tenant_id,
                            db.or_(
                                Volunteer.active.is_(False),
                                Volunteer.is_deleted.is_(True)
                            )
                        )
                        .order_by(Volunteer.date_inactive.desc() if Volunteer.date_inactive else Volunteer.date_modified.desc())
                        .all()
                    )
            else:
                # Get all volunteers
                volunteers = (
                    Volunteer.query.filter(
                        Volunteer.tenant_id == tenant_id,
                        Volunteer.is_deleted.is_(False)
                    )
                    .order_by(Volunteer.date_active.desc() if Volunteer.date_active else Volunteer.date_entered.desc())
                    .all()
                )
            
            volunteers_data = []
            for volunteer in volunteers:
                pco = PCO.query.get(volunteer.pco_id) if volunteer.pco_id else None
                volunteers_data.append(_volunteer_to_dict(volunteer, pco))
            
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Volunteers retrieved successfully",
                "data": {
                    "volunteers": volunteers_data
                }
            }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting volunteers: {str(e)}"]
        }), 400


@volunteers_bp.get("/get-volunteers/<string:status>")
@jwt_required()
def get_volunteers_by_status(status: str):
    """Get volunteers by tenant ID and status (active/inactive).
    
    status should be 'true' for active volunteers, 'false' for inactive.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        is_active = status.lower() == "true"
        
        if is_active:
            # Active volunteers: active and not deleted
            volunteers = (
                Volunteer.query.filter(
                    Volunteer.tenant_id == tenant_id,
                    Volunteer.active.is_(True),
                    Volunteer.is_deleted.is_(False),
                )
                .order_by(Volunteer.date_active.desc() if Volunteer.date_active else Volunteer.date_entered.desc())
                .all()
            )
        else:
            # Inactive volunteers: inactive or deleted
            volunteers = (
                Volunteer.query.filter(
                    Volunteer.tenant_id == tenant_id,
                    db.or_(
                        Volunteer.active.is_(False),
                        Volunteer.is_deleted.is_(True)
                    )
                )
                .order_by(Volunteer.date_inactive.desc() if Volunteer.date_inactive else Volunteer.date_modified.desc())
                .all()
            )
        
        # Get PCO information for each volunteer
        volunteers_data = []
        for volunteer in volunteers:
            pco = PCO.query.get(volunteer.pco_id) if volunteer.pco_id else None
            volunteers_data.append(_volunteer_to_dict(volunteer, pco))
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteers retrieved successfully",
            "data": {
                "volunteers": volunteers_data
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting volunteers: {str(e)}"]
        }), 400


@volunteers_bp.post("/create-volunteer")
@jwt_required()
def create_volunteer():
    """Create a new volunteer.
    
    Request body:
    {
        "pcoId": 1,
        "notes": "Volunteer notes",
        "active": true,
        "dateActive": "2024-01-01T00:00:00"
    }
    """
    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    payload = request.get_json(silent=True) or {}
    pco_id = payload.get("pcoId")
    notes = (payload.get("notes") or "").strip()
    active = payload.get("active", True)
    date_active = payload.get("dateActive")
    
    if not pco_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["PCO ID is required."]
        }), 400
    
    # Verify PCO exists and belongs to tenant
    pco = PCO.query.get(pco_id)
    if not pco:
        return jsonify({
            "success": False,
            "statusCode": 404,
            "errors": ["PCO not found."]
        }), 404
    
    if pco.tenant_id != tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Unauthorized access to this PCO"]
        }), 403
    
    # Check if volunteer already exists for this PCO
    existing = Volunteer.query.filter(
        Volunteer.pco_id == pco_id,
        Volunteer.tenant_id == tenant_id,
        Volunteer.is_deleted.is_(False)
    ).first()
    
    if existing:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer already exists for this PCO."]
        }), 400
    
    try:
        # Parse date_active if provided
        date_active_dt = None
        if date_active:
            try:
                date_active_dt = datetime.fromisoformat(date_active.replace('Z', '+00:00'))
            except:
                date_active_dt = datetime.utcnow()
        else:
            date_active_dt = datetime.utcnow() if active else None
        
        new_volunteer = Volunteer(
            pco_id=pco_id,
            tenant_id=tenant_id,
            notes=notes,
            active=active,
            date_active=date_active_dt,
            date_entered=datetime.utcnow(),
            entered_by=username,
        )
        
        db.session.add(new_volunteer)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer created successfully!",
            "data": {
                "volunteer": _volunteer_to_dict(new_volunteer, pco)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Volunteer creation failed: {str(e)}"]
        }), 400


@volunteers_bp.put("/update-volunteer/<int:volunteer_id>")
@jwt_required()
def update_volunteer(volunteer_id: int):
    """Update a volunteer by ID."""
    if volunteer_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer identifier required"]
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
        volunteer = Volunteer.query.get(volunteer_id)
        
        if not volunteer:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["Volunteer does not exist!"]
            }), 404
        
        # Check if volunteer belongs to the tenant
        if volunteer.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        payload = request.get_json(silent=True) or {}
        
        # Update fields
        if "notes" in payload:
            volunteer.notes = (payload["notes"] or "").strip()
        
        if "active" in payload:
            new_active = payload["active"]
            volunteer.active = new_active
            
            # Update dates based on active status
            if new_active and not volunteer.date_active:
                volunteer.date_active = datetime.utcnow()
            elif not new_active and not volunteer.date_inactive:
                volunteer.date_inactive = datetime.utcnow()
        
        if "dateActive" in payload and payload["dateActive"]:
            try:
                volunteer.date_active = datetime.fromisoformat(payload["dateActive"].replace('Z', '+00:00'))
            except:
                pass
        
        if "dateInactive" in payload and payload["dateInactive"]:
            try:
                volunteer.date_inactive = datetime.fromisoformat(payload["dateInactive"].replace('Z', '+00:00'))
            except:
                pass
        
        volunteer.modified_by = username
        volunteer.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        # Get PCO for response
        pco = PCO.query.get(volunteer.pco_id) if volunteer.pco_id else None
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer updated successfully!",
            "data": {
                "volunteer": _volunteer_to_dict(volunteer, pco)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating volunteer: {str(e)}"]
        }), 400


@volunteers_bp.patch("/delete-volunteer/<int:volunteer_id>")
@jwt_required()
def delete_volunteer(volunteer_id: int):
    """Soft delete (deactivate) a volunteer by ID."""
    if volunteer_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer identifier required"]
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
        volunteer = Volunteer.query.get(volunteer_id)
        
        if not volunteer:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["Volunteer not found!"]
            }), 404
        
        # Check if volunteer belongs to the tenant
        if volunteer.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        # Soft delete
        volunteer.is_deleted = True
        volunteer.active = False
        if not volunteer.date_inactive:
            volunteer.date_inactive = datetime.utcnow()
        volunteer.modified_by = username
        volunteer.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer deactivated successfully!",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting volunteer: {str(e)}"]
        }), 400


@volunteers_bp.post("/upsert-volunteer")
@jwt_required()
def upsert_volunteer():
    """Create or update a volunteer and their activities.
    
    Request body:
    {
        "pcoId": 1,
        "notes": "Volunteer notes",
        "active": true,
        "dateActive": "2024-01-01T00:00:00",
        "dateInactive": "2024-01-01T00:00:00",
        "volunteerActivityIds": [1, 2, 3]
    }
    """
    tenant_id = _get_tenant_id_from_jwt()
    username = _get_username_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    payload = request.get_json(silent=True) or {}
    pco_id = payload.get("pcoId")
    notes = (payload.get("notes") or "").strip()
    active = payload.get("active", True)
    date_active = payload.get("dateActive")
    date_inactive = payload.get("dateInactive")
    volunteer_activity_ids = payload.get("volunteerActivityIds", [])
    
    if not pco_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["PCO ID is required."]
        }), 400
    
    if not volunteer_activity_ids or len(volunteer_activity_ids) == 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["At least one volunteer activity is required."]
        }), 400
    
    # Verify PCO exists and belongs to tenant
    pco = PCO.query.get(pco_id)
    if not pco:
        return jsonify({
            "success": False,
            "statusCode": 404,
            "errors": ["PCO not found."]
        }), 404
    
    if pco.tenant_id != tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Unauthorized access to this PCO"]
        }), 403
    
    try:
        # Parse dates
        date_active_dt = None
        if date_active:
            try:
                date_active_dt = datetime.fromisoformat(date_active.replace('Z', '+00:00'))
            except:
                date_active_dt = datetime.utcnow() if active else None
        else:
            date_active_dt = datetime.utcnow() if active else None
        
        date_inactive_dt = None
        if date_inactive:
            try:
                date_inactive_dt = datetime.fromisoformat(date_inactive.replace('Z', '+00:00'))
            except:
                pass
        
        # Find existing volunteer or create new
        volunteer = Volunteer.query.filter(
            Volunteer.pco_id == pco_id,
            Volunteer.tenant_id == tenant_id,
            Volunteer.is_deleted.is_(False)
        ).first()
        
        if volunteer:
            # Update existing volunteer
            volunteer.notes = notes
            volunteer.active = active
            volunteer.date_active = date_active_dt
            volunteer.date_inactive = date_inactive_dt
            volunteer.modified_by = username
            volunteer.date_modified = datetime.utcnow()
        else:
            # Create new volunteer
            volunteer = Volunteer(
                pco_id=pco_id,
                tenant_id=tenant_id,
                notes=notes,
                active=active,
                date_active=date_active_dt,
                date_inactive=date_inactive_dt,
                date_entered=datetime.utcnow(),
                entered_by=username,
            )
            db.session.add(volunteer)
        
        db.session.flush()  # Get volunteer.id
        
        # Handle volunteer activities
        # First, soft delete all existing activities for this PCO
        existing_activities = VolunteerPersonActivity.query.filter(
            VolunteerPersonActivity.pco_id == pco_id,
            VolunteerPersonActivity.tenant_id == tenant_id
        ).all()
        
        for existing in existing_activities:
            existing.is_deleted = True
            existing.modified_by = username
            existing.date_modified = datetime.utcnow()
        
        # Create new volunteer person activities
        for activity_id in volunteer_activity_ids:
            # Check if activity exists and belongs to tenant
            activity = VolunteerActivity.query.filter(
                VolunteerActivity.id == activity_id,
                VolunteerActivity.tenant_id == tenant_id,
                VolunteerActivity.is_deleted.is_(False)
            ).first()
            
            if not activity:
                continue  # Skip invalid activities
            
            # Check if this activity already exists (not deleted)
            existing = VolunteerPersonActivity.query.filter(
                VolunteerPersonActivity.pco_id == pco_id,
                VolunteerPersonActivity.volunteer_activity_id == activity_id,
                VolunteerPersonActivity.tenant_id == tenant_id,
                VolunteerPersonActivity.is_deleted.is_(False)
            ).first()
            
            if existing:
                # Restore if it was deleted
                existing.is_deleted = False
                existing.modified_by = username
                existing.date_modified = datetime.utcnow()
            else:
                # Create new
                new_activity = VolunteerPersonActivity(
                    pco_id=pco_id,
                    volunteer_activity_id=activity_id,
                    tenant_id=tenant_id,
                    date_entered=datetime.utcnow(),
                    entered_by=username,
                )
                db.session.add(new_activity)
        
        db.session.commit()
        
        # Get updated volunteer data with activities
        activities = VolunteerPersonActivity.query.filter(
            VolunteerPersonActivity.pco_id == pco_id,
            VolunteerPersonActivity.tenant_id == tenant_id,
            VolunteerPersonActivity.is_deleted.is_(False)
        ).all()
        
        activity_customs = []
        for activity in activities:
            va = VolunteerActivity.query.get(activity.volunteer_activity_id)
            if va:
                activity_customs.append({
                    "volunteerActivityId": va.id,
                    "volunteerActivityName": va.volunteer_activity_name,
                    "pcoId": pco_id,
                    "tenantId": tenant_id
                })
        
        volunteer_data = {
            "id": volunteer.id,
            "pcoId": volunteer.pco_id,
            "notes": volunteer.notes or "",
            "active": volunteer.active,
            "dateActive": volunteer.date_active.isoformat() if volunteer.date_active else None,
            "dateInactive": volunteer.date_inactive.isoformat() if volunteer.date_inactive else None,
            "volunteerActivityCustoms": activity_customs
        }
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer saved successfully!",
            "data": {
                "volunteerPersonCustom": volunteer_data
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while saving volunteer: {str(e)}"]
        }), 400

