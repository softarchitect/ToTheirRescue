from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import SAVolunteerActivity, User


sa_volunteer_activity_bp = Blueprint("sa_volunteer_activity", __name__)


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


@sa_volunteer_activity_bp.get("/get-savolunteeractivity")
@jwt_required()
def get_sa_volunteer_activities():
    """Get all Super Admin volunteer activities."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    try:
        volunteer_activities = (
            SAVolunteerActivity.query.filter(
                SAVolunteerActivity.is_deleted.is_(False),
            )
            .order_by(SAVolunteerActivity.sa_volunteer_activity_name.asc())
            .all()
        )
        
        volunteer_activities_data = [
            {
                "id": va.id,
                "saVolunteerActivityName": va.sa_volunteer_activity_name,
            }
            for va in volunteer_activities
        ]
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Volunteer Activities retrieved successfully",
            "data": {
                "saVolunteerActivities": volunteer_activities_data,
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_volunteer_activity_bp.post("/create-savolunteeractivity")
@jwt_required()
def create_sa_volunteer_activity():
    """Create a new Super Admin volunteer activity."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    payload = request.get_json(silent=True) or {}
    volunteer_activity_name = payload.get("saVolunteerActivityName", "").strip()
    
    if not volunteer_activity_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer Activity Name is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        # Check if volunteer activity already exists
        existing = SAVolunteerActivity.query.filter(
            SAVolunteerActivity.is_deleted.is_(False),
            SAVolunteerActivity.sa_volunteer_activity_name == volunteer_activity_name
        ).first()
        
        if existing:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "Volunteer Activity already exists.",
                "data": {"isAvailable": False}
            }), 200
        
        # Create new SA volunteer activity
        new_activity = SAVolunteerActivity(
            sa_volunteer_activity_name=volunteer_activity_name,
            entered_by=username,
            date_entered=datetime.utcnow(),
            is_deleted=False
        )
        
        db.session.add(new_activity)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Volunteer Activity created successfully",
            "data": {
                "id": new_activity.id,
                "saVolunteerActivityName": new_activity.sa_volunteer_activity_name,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_volunteer_activity_bp.post("/update-savolunteeractivity/<int:activity_id>")
@jwt_required()
def update_sa_volunteer_activity(activity_id):
    """Update a Super Admin volunteer activity."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if activity_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Activity ID must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    volunteer_activity_name = payload.get("saVolunteerActivityName", "").strip()
    
    if not volunteer_activity_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Volunteer Activity Name is required."]
        }), 400
    
    username = _get_username_from_jwt()
    
    try:
        activity = SAVolunteerActivity.query.get(activity_id)
        
        if not activity:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        activity.sa_volunteer_activity_name = volunteer_activity_name
        activity.modified_by = username
        activity.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Volunteer Activity updated successfully",
            "data": {
                "id": activity.id,
                "saVolunteerActivityName": activity.sa_volunteer_activity_name,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400


@sa_volunteer_activity_bp.patch("/delete-savolunteeractivity/<int:activity_id>")
@jwt_required()
def delete_sa_volunteer_activity(activity_id):
    """Soft delete a Super Admin volunteer activity."""
    if not _check_super_admin():
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Access denied. Super Administrator role required."]
        }), 403
    
    if activity_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Activity ID must be greater than 0"]
        }), 400
    
    try:
        activity = SAVolunteerActivity.query.get(activity_id)
        
        if not activity:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Record not found"]
            }), 400
        
        activity.is_deleted = True
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "SA Volunteer Activity deleted successfully",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong: {str(e)}"]
        }), 400

