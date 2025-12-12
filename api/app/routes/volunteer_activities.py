from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import VolunteerActivity, User


volunteer_activities_bp = Blueprint("volunteer_activities", __name__)


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


@volunteer_activities_bp.get("/get-volunteer-activity")
@jwt_required(optional=True)
def get_volunteer_activities():
    """Port of the old api/volunteer-activity/get-volunteer-activity endpoint.
    
    Returns all active volunteer activities for the current tenant.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        volunteer_activities = (
            VolunteerActivity.query.filter(
                VolunteerActivity.is_deleted.is_(False),
                VolunteerActivity.tenant_id == tenant_id,
            )
            .order_by(VolunteerActivity.volunteer_activity_name.asc())
            .all()
        )
        
        volunteer_activities_data = [
            {
                "id": va.id,
                "volunteerActivityName": va.volunteer_activity_name,
            }
            for va in volunteer_activities
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer Activity retrieved successfully",
            "data": {
                "volunteerActivities": volunteer_activities_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@volunteer_activities_bp.post("/create-volunteer-activity")
@jwt_required()
def create_volunteer_activity():
    """Port of the old api/volunteer-activity/create-volunteer-activity endpoint.
    
    Request body:
        {
            "volunteerActivityName": "Dog Walking"
        }
    """
    payload = request.get_json(silent=True) or {}
    volunteer_activity_name = payload.get("volunteerActivityName", "").strip()
    
    if not volunteer_activity_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer Activity Name is required."]
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
        # Check if volunteer activity already exists (case-sensitive, tenant-scoped)
        existing = VolunteerActivity.query.filter(
            VolunteerActivity.is_deleted.is_(False),
            VolunteerActivity.volunteer_activity_name == volunteer_activity_name,
            VolunteerActivity.tenant_id == tenant_id
        ).first()
        
        if existing:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Volunteer Activity already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new volunteer activity
        new_volunteer_activity = VolunteerActivity(
            volunteer_activity_name=volunteer_activity_name,
            tenant_id=tenant_id,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_volunteer_activity)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer Activity added successfully",
            "data": {
                "id": new_volunteer_activity.id,
                "volunteerActivityName": new_volunteer_activity.volunteer_activity_name,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while adding record: {str(e)}"]
        }), 400


@volunteer_activities_bp.post("/update-volunteer-activity/<int:volunteer_activity_id>")
@jwt_required()
def update_volunteer_activity(volunteer_activity_id):
    """Port of the old api/volunteer-activity/update-volunteer-activity/{id} endpoint.
    
    Request body:
        {
            "volunteerActivityName": "Dog Walking"
        }
    """
    if volunteer_activity_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer Activity Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    volunteer_activity_name = payload.get("volunteerActivityName", "").strip()
    
    if not volunteer_activity_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid Volunteer Activity request."]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        volunteer_activity = VolunteerActivity.query.get(volunteer_activity_id)
        
        if not volunteer_activity:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": volunteer_activity_id},
                "errors": ["No record found"]
            }), 400
        
        # Check if it belongs to the tenant
        if volunteer_activity.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        # Check for duplicate name (excluding the current item)
        existing_duplicate = VolunteerActivity.query.filter(
            VolunteerActivity.id != volunteer_activity_id,
            VolunteerActivity.is_deleted.is_(False),
            VolunteerActivity.volunteer_activity_name == volunteer_activity_name,
            VolunteerActivity.tenant_id == tenant_id
        ).first()
        
        if existing_duplicate:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "message": "Volunteer Activity with this name already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Update the volunteer activity
        volunteer_activity.volunteer_activity_name = volunteer_activity_name
        volunteer_activity.modified_by = username
        volunteer_activity.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer Activity updated successfully",
            "data": {
                "id": volunteer_activity.id,
                "volunteerActivity": {
                    "id": volunteer_activity.id,
                    "volunteerActivityName": volunteer_activity.volunteer_activity_name,
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


@volunteer_activities_bp.patch("/delete-volunteer-activity/<int:volunteer_activity_id>")
@jwt_required()
def delete_volunteer_activity(volunteer_activity_id):
    """Port of the old api/volunteer-activity/delete-volunteer-activity/{id} endpoint.
    
    Soft deletes a volunteer activity by setting is_deleted to True.
    """
    if volunteer_activity_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer Activity Identifier must be greater than 0"]
        }), 400
    
    username = _get_username_from_jwt()
    tenant_id = _get_tenant_id_from_jwt()
    
    try:
        volunteer_activity = VolunteerActivity.query.get(volunteer_activity_id)
        
        if not volunteer_activity:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Volunteer Activity not found"]
            }), 400
        
        # Check if it belongs to the tenant
        if volunteer_activity.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Unauthorized access to this record"]
            }), 400
        
        volunteer_activity.is_deleted = True
        volunteer_activity.modified_by = username
        volunteer_activity.date_modified = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Volunteer Activity deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting record: {str(e)}"]
        }), 400


@volunteer_activities_bp.get("/available-volunteer-activity")
@jwt_required()
def available_volunteer_activity():
    """Port of the old api/volunteer-activity/available-volunteer-activity endpoint.
    
    Query params:
        - volunteerActivityName: The volunteer activity name to check
    
    Returns whether the volunteer activity name is available.
    """
    volunteer_activity_name = request.args.get("volunteerActivityName", type=str) or ""
    
    if not volunteer_activity_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer Activity is required."]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    try:
        existing = VolunteerActivity.query.filter(
            VolunteerActivity.is_deleted.is_(False),
            VolunteerActivity.volunteer_activity_name == volunteer_activity_name,
            VolunteerActivity.tenant_id == tenant_id
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Volunteer Activity already exists.",
                "data": {"isAvailable": False}
            }), 200
        else:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Volunteer Activity available",
                "data": {"isAvailable": True}
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while checking available record: {str(e)}"]
        }), 400

