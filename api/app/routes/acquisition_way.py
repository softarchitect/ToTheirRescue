from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import AcquisitionWay, User

acquisition_way_bp = Blueprint("acquisition_way", __name__)


@acquisition_way_bp.get("/get-acquisition-way")
@jwt_required(optional=True)
def get_acquisition_way():
    """Equivalent of GET api/acquisition-way/get-acquisition-way.
    
    Returns all active (non-deleted) acquisition ways for the authenticated user's tenant.
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "Acquisition Way record retrieved successfully",
        "data": {
            "acquisitionWays": [
                {
                    "id": 1,
                    "acquisitionWayName": "Born at Rescue",
                    "dateEntered": "2024-01-01T00:00:00",
                    "enteredBy": "user",
                    "isDeleted": false,
                    "isNotEditable": false,
                    "tenantId": 1
                }
            ]
        }
    }
    """
    try:
        # Get tenant_id from authenticated user
        user_id = get_jwt_identity()
        tenant_id = None
        
        if user_id:
            user = User.query.get(user_id)
            if user and user.tenant_id:
                tenant_id = user.tenant_id
        
        if not tenant_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["User or tenant not found."],
                    }
                ),
                400,
            )
        
        # Query active acquisition ways for the tenant
        acquisition_ways = (
            AcquisitionWay.query.filter(
                AcquisitionWay.is_deleted.is_(False),
                AcquisitionWay.tenant_id == tenant_id,
            )
            .order_by(AcquisitionWay.acquisition_way_name.asc())
            .all()
        )
        
        # Format response to match old API structure
        acquisition_ways_data = [
            {
                "id": aw.id,
                "acquisitionWayName": aw.acquisition_way_name,
                "dateEntered": aw.date_entered.isoformat() if aw.date_entered else None,
                "enteredBy": aw.entered_by or "",
                "isDeleted": aw.is_deleted,
                "isNotEditable": aw.is_not_editable,
                "tenantId": aw.tenant_id,
            }
            for aw in acquisition_ways
        ]
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Acquisition Way record retrieved successfully",
                "data": {
                    "acquisitionWays": acquisition_ways_data,
                },
            }
        )
    except Exception as ex:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "Oops! Something went wrong while getting AcquisitionWay record",
                        str(ex),
                    ],
                }
            ),
            400,
        )


@acquisition_way_bp.post("/create-acquisition-way")
@jwt_required(optional=True)
def create_acquisition_way():
    """Equivalent of POST api/acquisition-way/create-acquisition-way.
    
    Creates a new acquisition way for the authenticated user's tenant.
    
    Request body:
    {
        "acquisitionWayName": "Stray"
    }
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "Acquisition Way created successfully",
        "data": {
            "id": 1,
            "acquisitionWayName": "Born at Rescue",
            "dateEntered": "2024-01-01T00:00:00",
            "enteredBy": "user",
            "isDeleted": false,
            "isNotEditable": false,
            "tenantId": 1
        }
    }
    
    If the acquisition way already exists:
    {
        "success": false,
        "statusCode": 200,
        "message": "Acquisition Way already exists.",
        "data": {
            "isAvailable": false
        }
    }
    """
    try:
        payload = request.get_json(silent=True) or {}
        acquisition_way_name = (payload.get("acquisitionWayName") or "").strip()
        
        if not acquisition_way_name:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 200,
                        "errors": ["Invalid Acquisition Way request."],
                    }
                ),
                200,  # Old API returns 200 even on error
            )
        
        # Get tenant_id and username from authenticated user
        user_id = get_jwt_identity()
        username = ""
        tenant_id = None
        
        if user_id:
            jwt_data = get_jwt()
            username = jwt_data.get("username") or ""
            user = User.query.get(user_id)
            if user and user.tenant_id:
                tenant_id = user.tenant_id
                if not username:
                    username = user.user_name or ""
        
        if not tenant_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 200,
                        "errors": ["User or tenant not found."],
                    }
                ),
                200,
            )
        
        # Check if acquisition way already exists
        existing = (
            AcquisitionWay.query.filter(
                AcquisitionWay.is_deleted.is_(False),
                AcquisitionWay.acquisition_way_name == acquisition_way_name,
                AcquisitionWay.tenant_id == tenant_id,
            )
            .first()
        )
        
        if existing:
            return jsonify(
                {
                    "success": False,
                    "statusCode": 200,
                    "message": "Acquisition Way already exists.",
                    "data": {
                        "isAvailable": False,
                    },
                }
            )
        
        # Create new acquisition way
        acquisition_way = AcquisitionWay(
            acquisition_way_name=acquisition_way_name,
            date_entered=datetime.utcnow(),
            entered_by=username or "system",
            is_deleted=False,
            is_not_editable=False,
            tenant_id=tenant_id,
        )
        
        db.session.add(acquisition_way)
        db.session.commit()
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Acquisition Way created successfully",
                "data": {
                    "id": acquisition_way.id,
                    "acquisitionWayName": acquisition_way.acquisition_way_name,
                    "dateEntered": acquisition_way.date_entered.isoformat() if acquisition_way.date_entered else None,
                    "enteredBy": acquisition_way.entered_by or "",
                    "isDeleted": acquisition_way.is_deleted,
                    "isNotEditable": acquisition_way.is_not_editable,
                    "tenantId": acquisition_way.tenant_id,
                },
            }
        )
    except Exception as ex:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 200,
                    "errors": [
                        "Oops! Something went wrong while adding AcquisitionWay record",
                        str(ex),
                    ],
                }
            ),
            200,
        )

