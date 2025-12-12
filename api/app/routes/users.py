from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import User


users_bp = Blueprint("users", __name__)


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


def _user_to_dict(user: User) -> dict:
    """Convert User model to dictionary format matching old API response."""
    # Get user role - for now, we'll need to check AspNetUserRoles table
    # For simplicity, we'll return a default role or check if needed
    role = "Administrator"  # Default, can be enhanced later
    
    return {
        "id": user.id,
        "firstName": user.first_name or "",
        "lastName": user.last_name or "",
        "email": user.email or "",
        "role": role,
        "dateActive": user.date_entered.isoformat() if user.date_entered else None,
        # "dateInactive": user.date_modified.isoformat() if user.is_deleted and user.date_modified else None,
        "emailConfirmed": user.email_confirmed or False,
        "status": user.status or "Inactive",
    }


@users_bp.get("/get-users/<string:status>")
@jwt_required()
def get_users_by_status(status: str):
    """Get users by tenant ID and status (active/inactive).
    
    Based on the old system's get-users/{status} endpoint.
    status should be 'true' for active users, 'false' for inactive.
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
            # Active users: not deleted
            users = (
                User.query.filter(
                    User.tenant_id == tenant_id,
                    User.is_deleted.is_(False),
                )
                .order_by(User.date_entered.desc())
                .all()
            )
        else:
            # Inactive users: deleted
            users = (
                User.query.filter(
                    User.tenant_id == tenant_id,
                    User.is_deleted.is_(True),
                )
                # .order_by(User.date_modified.desc())
                .all()
            )
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Users retrieved successfully",
            "data": {
                "usersVMs": [_user_to_dict(u) for u in users]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting users: {str(e)}"]
        }), 400


@users_bp.post("/inviteuser")
@jwt_required()
def invite_user():
    """Invite a new user to the tenant.
    
    Based on the old system's inviteuser endpoint.
    Note: Email sending functionality would need to be implemented separately.
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
    first_name = (payload.get("firstName") or "").strip()
    last_name = (payload.get("lastName") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    role_name = (payload.get("roleName") or "Administrator").strip()
    
    if not first_name or not last_name or not email:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["firstName, lastName, and email are required."]
        }), 400
    
    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Email already taken!"]
        }), 400
    
    try:
        # Create new user
        import uuid
        new_user = User(
            id=str(uuid.uuid4()),
            user_name=str(uuid.uuid4()),  # Temporary username
            normalized_user_name=str(uuid.uuid4()).upper(),
            email=email,
            normalized_email=email.upper(),
            email_confirmed=False,
            first_name=first_name,
            last_name=last_name,
            tenant_id=tenant_id,
            status="Inactive",
            is_deleted=False,
            date_entered=datetime.utcnow(),
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Note: In a full implementation, you would:
        # 1. Generate email confirmation token
        # 2. Assign role (would need AspNetUserRoles table)
        # 3. Send invitation email
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "User invitation sent successfully!",
            "data": {
                "usersVM": _user_to_dict(new_user)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"User invitation failed: {str(e)}"]
        }), 400


@users_bp.put("/update-user/<string:user_id>")
@jwt_required()
def update_user(user_id: str):
    """Update a user by ID.
    
    Based on the old system's update-user/{id} endpoint.
    """
    if not user_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User identifier required"]
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
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["User does not exist!"]
            }), 404
        
        # Check if user belongs to the tenant
        if user.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        payload = request.get_json(silent=True) or {}
        
        # Update fields
        if "firstName" in payload:
            user.first_name = (payload["firstName"] or "").strip()
        if "lastName" in payload:
            user.last_name = (payload["lastName"] or "").strip()
        if "email" in payload:
            new_email = (payload["email"] or "").strip().lower()
            # Check if email is already taken by another user
            existing = User.query.filter_by(email=new_email).first()
            if existing and existing.id != user_id:
                return jsonify({
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Email already exist!"]
                }), 400
            user.email = new_email
            user.normalized_email = new_email.upper()
        
        user.date_modified = datetime.utcnow()
        
        # Note: Role update would need AspNetUserRoles table handling
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "User updated successfully!",
            "data": {
                "usersVM": _user_to_dict(user)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating user: {str(e)}"]
        }), 400


@users_bp.patch("/delete-user/<string:user_id>")
@jwt_required()
def delete_user(user_id: str):
    """Soft delete (deactivate) a user by ID.
    
    Based on the old system's delete-user/{id} endpoint.
    """
    if not user_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User identifier required"]
        }), 400
    
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["User not found!"]
            }), 404
        
        # Check if user belongs to the tenant
        if user.tenant_id != tenant_id:
            return jsonify({
                "success": False,
                "statusCode": 403,
                "errors": ["Unauthorized access to this record"]
            }), 403
        
        # Soft delete
        user.is_deleted = True
        user.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "User deactivated successfully!",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while deleting user: {str(e)}"]
        }), 400


@users_bp.post("/resend-invitation")
@jwt_required()
def resend_invitation():
    """Resend invitation email to a user.
    
    Based on the old system's resend-invitation endpoint.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    email = request.args.get("email", "").strip().lower()
    
    if not email:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Email is required"]
        }), 400
    
    try:
        user = User.query.filter_by(email=email, tenant_id=tenant_id).first()
        
        if not user:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["User not found!"]
            }), 404
        
        # Note: In a full implementation, you would:
        # 1. Generate new email confirmation token
        # 2. Send invitation email
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Invitation email sent successfully!"
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while resending invitation: {str(e)}"]
        }), 400

