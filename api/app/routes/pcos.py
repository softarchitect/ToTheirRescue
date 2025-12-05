from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import PCO, User, Tenant

pcos_bp = Blueprint("pcos", __name__)


@pcos_bp.get("/get-pco")
def get_pcos():
    """Rough equivalent of GET api/PCO/get-pco.

    For now we ignore tenant filters and entityType and just support:
      - searchText: matches first/last name or email
      - page / limit pagination
    """
    search_text = request.args.get("searchText", "", type=str)
    page = request.args.get("Page", request.args.get("page", 1, type=int), type=int)
    limit = request.args.get("Limit", request.args.get("limit", 20, type=int), type=int)

    query = PCO.query.filter(PCO.is_deleted.is_(False))

    if search_text:
        pattern = f"%{search_text.lower()}%"
        query = query.filter(
            db.or_(
                db.func.lower(PCO.last_name).like(pattern),
                db.func.lower(PCO.first_name).like(pattern),
                db.func.lower(PCO.email).like(pattern),
            )
        )

    total_items = query.count()
    items = (
        query.order_by(PCO.last_name.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    data = [p.to_dict_basic() for p in items]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "PCOs retrieved successfully",
            "data": {
                "currentPage": page,
                "totalItems": total_items,
                "totalPage": (total_items + limit - 1) // limit if limit else 1,
                "pcos": data,
            },
        }
    )


@pcos_bp.post("/create-pco")
@jwt_required(optional=True)
def create_pco():
    """Equivalent of POST api/PCO/create-pco?force=false.
    
    Creates a new PCO (person/company/organization).
    
    Query params:
      - force: if False (default), checks if PCO name is already taken
    
    Request body fields:
      - firstName, lastName, street, city, state, zip, phone, email
      - website, otherPhone, notes
      - rescue, hospital, mailList, flag, flagReason
      - entityType: "Person" or "Company" (defaults to "Person")
      - countryId: optional, defaults to tenant's countryId
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "PCO added successfully",
        "data": {
            "id": 1,
            "pco": { ... }
        }
    }
    """
    try:
        payload = request.get_json(silent=True) or {}
        force = request.args.get("force", "false", type=str).lower() == "true"
        
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
                200,  # Old API returns 200 even on error
            )
        
        # Get tenant for default CountryId
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 200,
                        "errors": ["Tenant not found."],
                    }
                ),
                200,
            )
        
        # Extract and validate fields
        last_name = (payload.get("lastName") or "").strip()
        first_name = (payload.get("firstName") or "").strip()
        entity_type = (payload.get("entityType") or "Person").strip()
        state = (payload.get("state") or "").strip()
        
        # Validation
        if not entity_type or not last_name:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 200,
                        "errors": ["Invalid PCO request."],
                    }
                ),
                200,
            )
        
        if len(state) > 50:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 200,
                        "errors": ["Invalid PCO request."],
                    }
                ),
                200,
            )
        
        # Normalize entity type
        if entity_type.lower() == "person":
            entity_type = "Person"
        else:
            entity_type = "CorO"  # Company_Organisation
        
        # Check if PCO name is available (if force=False)
        if not force:
            is_person = entity_type == "Person"
            existing_query = PCO.query.filter(
                PCO.is_deleted.is_(False),
                PCO.tenant_id == tenant_id,
                PCO.entity_type == entity_type,
                PCO.last_name == last_name,
            )
            
            # For Person type, also check FirstName
            if is_person:
                existing_query = existing_query.filter(PCO.first_name == first_name)
            
            existing = existing_query.first()
            
            if existing:
                return (
                    jsonify(
                        {
                            "success": False,
                            "statusCode": 200,
                            "errors": ["PCO name already taken."],
                        }
                    ),
                    200,
                )
        
        # Get CountryId from payload or default to tenant's CountryId
        country_id = payload.get("countryId") or 0
        if country_id == 0:
            country_id = tenant.country_id
        
        # Create PCO
        pco = PCO(
            first_name=first_name,
            last_name=last_name,
            street=(payload.get("street") or "").strip(),
            street2=(payload.get("street2") or "").strip(),
            city=(payload.get("city") or "").strip(),
            state=state,
            zip=(payload.get("zip") or "").strip(),
            phone=(payload.get("phone") or "").strip(),
            other_phone=(payload.get("otherPhone") or "").strip(),
            email=(payload.get("email") or "").strip(),
            website=(payload.get("website") or "").strip(),
            notes=(payload.get("notes") or "").strip(),
            entity_type=entity_type,
            rescue=payload.get("rescue", False),
            hospital=payload.get("hospital", False),
            mail_list=payload.get("mailList", False),
            flag=payload.get("flag", False),
            flag_reason=(payload.get("flagReason") or "").strip(),
            country_id=country_id,
            tenant_id=tenant_id,
            entered_by=username or "system",
            date_entered=datetime.utcnow(),
        )
        
        db.session.add(pco)
        db.session.commit()
        
        # Format response to match old API structure (PCOCustom)
        pco_custom = {
            "id": pco.id,
            "systemRecord": pco.system_record,
            "firstName": pco.first_name or "",
            "lastName": pco.last_name or "",
            "street": pco.street or "",
            "street2": pco.street2 or "",
            "city": pco.city or "",
            "state": pco.state or "",
            "zip": pco.zip or "",
            "phone": pco.phone or "",
            "otherPhone": pco.other_phone or "",
            "email": pco.email or "",
            "mailList": pco.mail_list,
            "website": pco.website or "",
            "contact": pco.contact or "",
            "rescueContact": pco.rescue_contact or "",
            "notes": pco.notes or "",
            "entityType": pco.entity_type or "",
            "hospital": pco.hospital,
            "rescue": pco.rescue,
            "flag": pco.flag,
            "flagReason": pco.flag_reason or "",
            "dateEntered": pco.date_entered.isoformat() if pco.date_entered else None,
            "dateModified": pco.date_modified.isoformat() if pco.date_modified else None,
            "enteredBy": pco.entered_by or "",
            "modifiedBy": pco.modified_by or "",
            "isDeleted": pco.is_deleted,
            "countryId": pco.country_id,
            "tenantId": pco.tenant_id,
        }
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "PCO added successfully",
                "data": {
                    "id": pco.id,
                    "pco": pco_custom,
                },
            }
        )
    except Exception as ex:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 200,
                    "errors": [
                        "Oops! Something went wrong while adding PCO",
                        str(ex),
                    ],
                }
            ),
            200,
        )


@pcos_bp.post("/create-pco-other-rescue")
@jwt_required(optional=True)
def create_pco_other_rescue():
    """Equivalent of POST api/PCO/create-pco-other-rescue.
    
    Creates a new PCO that represents an "Other Rescue/Shelter/Sanctuary".
    This is a simplified PCO creation specifically for rescues.
    
    Request body:
    {
        "lastNameOtherRescue": "Rescue Name"
    }
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "PCO other rescue created successfully",
        "data": {
            "id": 1,
            "lastNameOtherRescue": "Rescue Name"
        }
    }
    """
    try:
        payload = request.get_json(silent=True) or {}
        rescue_name = (payload.get("lastNameOtherRescue") or "").strip()
        
        if not rescue_name:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Rescue name is required."],
                    }
                ),
                400,
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
                        "statusCode": 400,
                        "errors": ["User or tenant not found."],
                    }
                ),
                400,
            )
        
        # Get tenant for default CountryId
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Tenant not found."],
                    }
                ),
                400,
            )
        
        # Check if rescue already exists
        existing = (
            PCO.query.filter(
                PCO.is_deleted.is_(False),
                PCO.tenant_id == tenant_id,
                PCO.entity_type == "CorO",
                PCO.rescue.is_(True),
                PCO.last_name == rescue_name,
            )
            .first()
        )
        
        if existing:
            return jsonify(
                {
                    "success": True,
                    "statusCode": 200,
                    "message": "Rescue already exists.",
                    "data": {
                        "id": existing.id,
                        "lastNameOtherRescue": existing.last_name,
                    },
                }
            )
        
        # Create PCO as a rescue organization
        pco = PCO(
            first_name="",  # Empty for company/organization
            last_name=rescue_name,
            street="",
            city="",
            state="",
            zip="",
            phone="",
            other_phone="",
            email="",
            website="",
            notes="",
            entity_type="CorO",  # Company/Organization
            rescue=True,  # Mark as rescue
            hospital=False,
            mail_list=False,
            flag=False,
            flag_reason="",
            country_id=tenant.country_id if tenant else 0,
            tenant_id=tenant_id,
            entered_by=username or "system",
            date_entered=datetime.utcnow(),
        )
        
        db.session.add(pco)
        db.session.commit()
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "PCO other rescue created successfully",
                "data": {
                    "id": pco.id,
                    "lastNameOtherRescue": pco.last_name,
                },
            }
        )
    except Exception as ex:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "Oops! Something went wrong while creating PCO other rescue",
                        str(ex),
                    ],
                }
            ),
            400,
        )


@pcos_bp.get("/get-pco-other-rescues")
@jwt_required(optional=True)
def get_pco_other_rescues():
    """Equivalent of GET api/PCO/get-pco-other-rescues.
    
    Returns a list of PCOs that are:
    - Company/Organization entities (EntityType == "CorO")
    - Rescue organizations (Rescue == True)
    - Not deleted (IsDeleted == False)
    - Belonging to the authenticated user's tenant
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "PCO other rescues retrieved.",
        "data": {
            "pcoOtherRescues": [
                {
                    "id": 1,
                    "lastNameOtherRescue": "Rescue Name"
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
        
        # Query PCOs matching the criteria
        rescues = (
            PCO.query.filter(
                PCO.tenant_id == tenant_id,
                PCO.entity_type == "CorO",
                PCO.rescue.is_(True),
                PCO.is_deleted.is_(False),
            )
            .order_by(PCO.last_name.asc())
            .all()
        )
        
        # Format response to match old API structure
        pco_other_rescues = [
            {
                "id": rescue.id,
                "lastNameOtherRescue": rescue.last_name,
            }
            for rescue in rescues
        ]
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "PCO other rescues retrieved.",
                "data": {
                    "pcoOtherRescues": pco_other_rescues,
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
                        "Oops! Something went wrong while getting PCO other rescues",
                        str(ex),
                    ],
                }
            ),
            400,
        )


