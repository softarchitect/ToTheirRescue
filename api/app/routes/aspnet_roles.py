from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import uuid

from ..extensions import db
from ..models import AspNetRole, AspNetUserRole


aspnet_roles_bp = Blueprint("aspnet_roles", __name__)

DEFAULT_SYSTEM_ROLES = [
    "Administrator",
    "AnimalManager",
    "AnimalCaretaker",
    "Veterinarian",
    "SuperAdministrator",
]


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "")


def _role_to_dict(role: AspNetRole) -> dict:
    """Convert AspNetRole model to dictionary format matching IdentityRole."""
    return {
        "id": role.id,
        "name": role.name or "",
        "normalizedName": role.normalized_name or "",
        "concurrencyStamp": role.concurrency_stamp or "",
    }

def _ensure_default_roles():
    """Ensure baseline system roles exist.

    Production databases can be missing role seed data, which causes
    user invite/edit role dropdowns to appear empty.
    """
    existing = AspNetRole.query.all()
    existing_normalized = {
        (role.normalized_name or (role.name or "").upper()).strip()
        for role in existing
    }

    missing = [name for name in DEFAULT_SYSTEM_ROLES if name.upper() not in existing_normalized]
    if not missing:
        return

    for role_name in missing:
        db.session.add(
            AspNetRole(
                id=str(uuid.uuid4()),
                name=role_name,
                normalized_name=role_name.upper(),
                concurrency_stamp=str(uuid.uuid4()),
            )
        )
    db.session.commit()


@aspnet_roles_bp.get("/get-user-roles")
@jwt_required()
def get_user_roles():
    """Get all roles.
    
    Port of the old api/user-role/get-user-roles endpoint.
    Returns a list of all AspNetRoles matching IdentityRole format.
    """
    try:
        _ensure_default_roles()
        roles = AspNetRole.query.order_by(AspNetRole.name.asc()).all()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Roles retrieved successfully",
            "data": {
                "roles": [_role_to_dict(role) for role in roles]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting roles: {str(e)}"]
        }), 400


@aspnet_roles_bp.get("/get-user-role-by-id")
@jwt_required()
def get_user_role_by_id():
    """Get a single role by ID.
    
    Port of the old api/user-role/get-user-role-by-id endpoint.
    Query params:
        - roleId: The ID of the role to retrieve
    """
    role_id = request.args.get("roleId", type=str) or ""
    
    if not role_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Role Id is required."]
        }), 400
    
    try:
        role = AspNetRole.query.get(role_id)
        
        if not role:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Role not found"]
            }), 400
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "User role retrieved successfully.",
            "data": {
                "id": role.id,
                "name": role.name or ""
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@aspnet_roles_bp.get("/get-user-role-by-name")
@jwt_required()
def get_user_role_by_name():
    """Get a single role by name.
    
    Port of the old api/user-role/get-user-role-by-name endpoint.
    Query params:
        - roleName: The name of the role to retrieve
    """
    role_name = request.args.get("roleName", type=str) or ""
    
    if not role_name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Role Name is required."]
        }), 400
    
    try:
        normalized_name = role_name.upper()
        role = AspNetRole.query.filter(
            AspNetRole.normalized_name == normalized_name
        ).first()
        
        if not role:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Role not found"]
            }), 400
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "User role retrieved successfully.",
            "data": {
                "id": role.id,
                "name": role.name or ""
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while getting record: {str(e)}"]
        }), 400


@aspnet_roles_bp.post("/create-user-role")
@jwt_required()
def create_user_role():
    """Create a new role.
    
    Port of the old api/user-role/create-user-role endpoint.
    Request body:
        {
            "name": "Administrator"
        }
    """
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    
    if not name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid user role request."]
        }), 400
    
    try:
        # Check if role with the same name already exists
        normalized_name = name.upper()
        existing_role = AspNetRole.query.filter(
            AspNetRole.normalized_name == normalized_name
        ).first()
        
        if existing_role:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {
                    "name": name,
                    "result": False,
                    "success": "Role Name already exists.",
                    "id": existing_role.id
                }
            }), 400
        
        # Generate role ID (typically a GUID in ASP.NET Identity)
        role_id = str(uuid.uuid4())
        
        # Generate concurrency stamp
        concurrency_stamp = str(uuid.uuid4())
        
        # Create new role
        new_role = AspNetRole(
            id=role_id,
            name=name,
            normalized_name=normalized_name,
            concurrency_stamp=concurrency_stamp
        )
        
        db.session.add(new_role)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Role created",
            "data": {
                "name": new_role.name,
                "id": new_role.id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 200,
            "errors": [f"Oops! something went wrong in adding new role: {str(e)}"]
        }), 200


@aspnet_roles_bp.post("/update-user-role/<string:id>")
@jwt_required()
def update_user_role(id: str):
    """Update an existing role.
    
    Port of the old api/user-role/update-user-role/{id} endpoint.
    Args:
        id: The ID of the role to update
    
    Request body:
        {
            "name": "Administrator"
        }
    """
    if not id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Role Id is required"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    
    if not name:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Invalid behavior request."]
        }), 400
    
    try:
        role = AspNetRole.query.get(id)
        
        if not role:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "data": {"id": id},
                "errors": ["No record found"]
            }), 400
        
        # Update role
        role.name = name
        role.normalized_name = name.upper()
        # Update concurrency stamp
        role.concurrency_stamp = str(uuid.uuid4())
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "User Role has updated successfully",
            "data": {
                "id": role.id,
                "identityRole": _role_to_dict(role)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating record: {str(e)}"]
        }), 400


@aspnet_roles_bp.delete("/delete-user-role/<string:id>")
@jwt_required()
def delete_user_role(id: str):
    """Delete a role by ID.
    
    Port of the old api/user-role/delete-user-role/{id} endpoint.
    Args:
        id: The ID of the role to delete
    
    Note: The old system doesn't check if role is assigned to users before deletion.
    It relies on database constraints to handle that.
    """
    if not id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Role Id is required."]
        }), 400
    
    try:
        role = AspNetRole.query.get(id)
        
        if not role:
            return jsonify({
                "success": False,
                "statusCode": 200,
                "errors": ["Record not found."]
            }), 200
        
        # Delete the role
        # Note: If role is assigned to users, database constraint will prevent deletion
        db.session.delete(role)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Role deleted",
            "data": {"isDeleted": True}
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! something went wrong in deleting role: {str(e)}"]
        }), 400

