from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

from ..extensions import db
from ..models import Tenant, User, Country

tenant_bp = Blueprint("tenant", __name__)


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


@tenant_bp.get("/get-tenant-info")
@jwt_required(optional=True)
def get_tenant_info():
    """Equivalent of GET api/tenant/get-tenant-info.
    
    Returns tenant information for the authenticated user's tenant.
    
    Response format matches the old API:
    {
        "success": true,
        "statusCode": 200,
        "message": "SUCCESS",
        "data": {
            "id": 1,
            "tenant": {
                "name": "Rescue Name",
                "tenantAcronym": "RN",
                "street": "123 Main St",
                "city": "City",
                "state": "State",
                "zip": "12345",
                "phone": "123-456-7890",
                "website": "https://example.com",
                "emailAddress": "email@example.com",
                "countryId": 1,
                "countryName": "United States",
                "countryISO2Code": "US",
                "countryISDCode": 1
            }
        }
    }
    """
    try:
        # Get tenant_id from authenticated user
        tenant_id = _get_tenant_id_from_jwt()
        
        if not tenant_id:
            return jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["User or tenant not found."],
                }
            ), 400
        
        # Get tenant info
        tenant = Tenant.query.filter(
            Tenant.id == tenant_id,
            Tenant.is_deleted.is_(False)
        ).first()
        
        if not tenant:
            return jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Tenant not found."],
                }
            ), 400
        
        # Get country info
        country = None
        country_name = ""
        country_iso2_code = ""
        country_isd_code = None
        
        if tenant.country_id:
            country = Country.query.get(tenant.country_id)
            if country:
                country_name = country.country_name or ""
                country_iso2_code = country.iso2_code or ""
                country_isd_code = country.isd_code
        
        # Build tenant model matching old CreateTenantVm structure
        tenant_model = {
            "name": tenant.name or "",
            "tenantAcronym": tenant.tenant_acronym or "",
            "street": tenant.street or "",
            "city": tenant.city or "",
            "state": tenant.state or "",
            "zip": tenant.zip or "",
            "phone": tenant.phone or "",
            "website": tenant.website or "",
            "emailAddress": tenant.email_address or "",
            "countryId": tenant.country_id,
            "countryName": country_name,
            "countryISO2Code": country_iso2_code,
            "countryISDCode": country_isd_code,
        }
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "SUCCESS",
                "data": {
                    "id": tenant.id,
                    "tenant": tenant_model,
                },
            }
        )
    
    except Exception as ex:
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": [
                    "Oops! Something wrong getting rescue information.",
                    str(ex),
                ],
            }
        ), 400


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "")


@tenant_bp.post("/update-tenant/<int:tenant_id>")
@jwt_required()
def update_tenant_info(tenant_id):
    """Port of the old api/tenant/update-tenant/{id} endpoint.
    
    Request body:
        {
            "name": "Rescue Name",
            "tenantAcronym": "RN",
            "street": "123 Main St",
            "city": "City",
            "state": "State",
            "zip": "12345",
            "phone": "123-456-7890",
            "website": "https://example.com",
            "emailAddress": "email@example.com",
            "countryId": 1,
            "countryName": "United States",
            "countryISO2Code": "US",
            "countryISDCode": 1
        }
    """
    if tenant_id <= 0:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["Identifier must be greater than 0"]
        }), 400
    
    payload = request.get_json(silent=True) or {}
    
    # Get the current user's tenant_id to ensure they can only update their own tenant
    current_user_tenant_id = _get_tenant_id_from_jwt()
    
    if not current_user_tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["User or tenant not found."]
        }), 400
    
    # Ensure user can only update their own tenant
    if tenant_id != current_user_tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 403,
            "errors": ["Unauthorized: You can only update your own tenant information."]
        }), 403
    
    username = _get_username_from_jwt()
    
    try:
        tenant = Tenant.query.filter(
            Tenant.id == tenant_id,
            Tenant.is_deleted.is_(False)
        ).first()
        
        if not tenant:
            return jsonify({
                "success": True,
                "statusCode": 200,
                "message": "No record found",
                "data": {"id": tenant_id}
            }), 200
        
        # Update fields (only update if provided, otherwise keep existing values)
        if "name" in payload:
            tenant.name = payload.get("name") or tenant.name
        if "tenantAcronym" in payload:
            tenant.tenant_acronym = payload.get("tenantAcronym") or tenant.tenant_acronym
        if "street" in payload:
            tenant.street = payload.get("street") or tenant.street
        if "city" in payload:
            tenant.city = payload.get("city") or tenant.city
        if "state" in payload:
            tenant.state = payload.get("state") or tenant.state
        if "zip" in payload:
            tenant.zip = payload.get("zip") or tenant.zip
        if "countryId" in payload or "countryISO2Code" in payload or "countryName" in payload:
            # Frontend may send countryId as string/number/null.
            # Persist only valid positive integers, but also support resolving/upserting
            # a Country record by ISO2 code or name when the Countries table is empty
            # or the provided id doesn't exist.
            try:
                country_id = int(payload.get("countryId") or 0)
            except (TypeError, ValueError):
                country_id = 0

            desired_country_id = None

            if country_id > 0:
                existing_by_id = Country.query.get(country_id)
                if existing_by_id:
                    desired_country_id = existing_by_id.id

            if desired_country_id is None:
                raw_iso2 = (payload.get("countryISO2Code") or "").strip().upper()
                raw_name = (payload.get("countryName") or "").strip()

                existing = None
                if raw_iso2:
                    existing = Country.query.filter(Country.iso2_code == raw_iso2).first()
                if not existing and raw_name:
                    existing = Country.query.filter(Country.country_name == raw_name).first()

                if existing:
                    desired_country_id = existing.id
                elif raw_iso2 or raw_name:
                    # Create a minimal Country record so future lookups work.
                    try:
                        isd = payload.get("countryISDCode")
                        isd_code = int(isd) if isd is not None and str(isd).strip() != "" else None
                    except (TypeError, ValueError):
                        isd_code = None

                    created = Country(
                        country_name=raw_name or raw_iso2,
                        iso2_code=raw_iso2 or None,
                        isd_code=isd_code,
                    )
                    db.session.add(created)
                    db.session.flush()  # assign created.id
                    desired_country_id = created.id

            if desired_country_id is not None:
                tenant.country_id = desired_country_id
        if "phone" in payload:
            tenant.phone = payload.get("phone") or tenant.phone
        if "website" in payload:
            tenant.website = payload.get("website") or tenant.website
        if "emailAddress" in payload:
            tenant.email_address = payload.get("emailAddress") or tenant.email_address
        if "notes" in payload:
            tenant.notes = payload.get("notes") or tenant.notes
        if "mailList" in payload:
            tenant.mail_list = payload.get("mailList", False)
        if "numberUsersPurchased" in payload:
            number_users = payload.get("numberUsersPurchased")
            if number_users and number_users > 0:
                tenant.number_users_purchased = number_users
        
        tenant.modified_by = username
        tenant.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        # Get updated country info
        country = None
        country_name = ""
        country_iso2_code = ""
        country_isd_code = None
        
        if tenant.country_id:
            country = Country.query.get(tenant.country_id)
            if country:
                country_name = country.country_name or ""
                country_iso2_code = country.iso2_code or ""
                country_isd_code = country.isd_code
        
        # Build response matching old API format
        tenant_model = {
            "name": tenant.name or "",
            "tenantAcronym": tenant.tenant_acronym or "",
            "street": tenant.street or "",
            "city": tenant.city or "",
            "state": tenant.state or "",
            "zip": tenant.zip or "",
            "phone": tenant.phone or "",
            "website": tenant.website or "",
            "emailAddress": tenant.email_address or "",
            "countryId": tenant.country_id,
            "countryName": country_name,
            "countryISO2Code": country_iso2_code,
            "countryISDCode": country_isd_code,
        }
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Tenant updated successfully",
            "data": {
                "id": tenant.id,
                "tenant": tenant_model,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong while updating record: {str(e)}"]
        }), 400

