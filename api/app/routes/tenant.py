from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

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

