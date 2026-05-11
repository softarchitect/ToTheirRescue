from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    decode_token,
    verify_jwt_in_request,
)
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from ..models import User, Tenant, OTP, Country, AspNetRole, AspNetUserRole, SystemSetting
from ..models.refresh_token import RefreshToken

auth_bp = Blueprint("auth", __name__)

DEFAULT_SUPER_ADMIN_USERNAME = "superadmin"
DEFAULT_SUPER_ADMIN_PASSWORD = "superadmin"
DEFAULT_SUPER_ADMIN_IDENTITY = "superadmin:local"
ONBOARDING_DEMO_SETTING_KEY = "onboarding_demo_enabled"


def _normalize_username(value: str) -> str:
    return (value or "").strip()


def _is_onboarding_demo_enabled() -> bool:
    setting = SystemSetting.query.filter(
        SystemSetting.key == ONBOARDING_DEMO_SETTING_KEY,
        SystemSetting.is_deleted.is_(False),
    ).first()
    return bool(setting.bool_value) if setting else False


def _get_role_name_for_user(user_id: str) -> str:
    user_role = (
        db.session.query(AspNetUserRole, AspNetRole)
        .join(AspNetRole, AspNetUserRole.role_id == AspNetRole.id)
        .filter(AspNetUserRole.user_id == user_id)
        .first()
    )

    if user_role:
        return user_role[1].name or ""

    return ""


@auth_bp.get("/onboarding-demo-enabled")
def onboarding_demo_enabled():
    """Public read-only flag used by signup UI messaging."""
    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "data": {
                "enabled": _is_onboarding_demo_enabled(),
            },
        }
    )


@auth_bp.post("/signup-admin")
def signup_admin():
    """Create a new rescue (tenant) and its admin user.

    This is a simplified port of the old AuthenticateController.signup-admin
    endpoint, tuned to the new frontend register form.

    Expected JSON (from new /auth/register UI):
    {
      "organizationName": "...",
      "acronym": "...",
      "street": "...",
      "city": "...",
      "state": "...",
      "country": "...",   # free-text for now
      "website": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "...",
      "userId": "...",
      "password": "...",
      "phone": "..."
    }
    """
    payload = request.get_json(silent=True) or {}

    org_name = (payload.get("organizationName") or "").strip()
    username = _normalize_username(payload.get("userId") or "")
    email = (payload.get("email") or "").strip()
    password = payload.get("password") or ""

    if not org_name or not username or not email or not password:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "message": "Organization name, User ID, email and password are required.",
                }
            ),
            400,
        )

    is_demo_registration = bool(payload.get("onboardingDemoRegistration")) and _is_onboarding_demo_enabled()

    # Ensure email OTP has been verified recently. Super Admin demo mode allows
    # generated no-input walkthrough accounts to skip email delivery.
    verified_otp = None
    if not is_demo_registration:
        verified_otp = (
            OTP.query.filter_by(email=email, is_email_otp_verified=True)
            .order_by(OTP.date_modified.desc())
            .first()
        )

    if not is_demo_registration and not verified_otp:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "message": "Email verification required before creating an account.",
                }
            ),
            400,
        )

    # Basic uniqueness checks (tenant by name, user by username/email)
    existing_tenant = Tenant.query.filter(
        db.func.lower(Tenant.name) == org_name.lower()
    ).first()
    if existing_tenant:
        return (
            jsonify(
                {
                    "success": False,
                    "status": "Error",
                    "message": "Rescue already exists!",
                }
            ),
            400,
        )

    existing_user = User.query.filter(
        db.or_(
            db.func.lower(User.user_name) == username.lower(),
            db.func.lower(User.email) == email.lower(),
        )
    ).first()
    if existing_user:
        return (
            jsonify(
                {
                    "success": False,
                    "status": "Error",
                    "message": "Username or email already exists!",
                }
            ),
            400,
        )

    # Resolve country if provided (new UI supports selecting a country)
    country_id = 0
    try:
        raw_country_id = payload.get("countryId")
        if raw_country_id is not None and str(raw_country_id).strip() != "":
            country_id = int(raw_country_id)
    except Exception:
        country_id = 0

    if not country_id:
        # Backwards compatibility: try to resolve by ISO2 code or country name
        country_iso2 = (payload.get("countryISO2Code") or payload.get("country") or "").strip()
        if country_iso2:
            country = Country.query.filter(db.func.lower(Country.iso2_code) == country_iso2.lower()).first()
            if not country:
                country = Country.query.filter(db.func.lower(Country.country_name) == country_iso2.lower()).first()
            if country:
                country_id = country.id

    zip_code = (payload.get("zip") or "").strip()

    # Create tenant
    tenant = Tenant(
        name=org_name,
        tenant_acronym=(payload.get("acronym") or "").strip(),
        street=(payload.get("street") or "").strip(),
        city=(payload.get("city") or "").strip(),
        state=(payload.get("state") or "").strip(),
        zip=zip_code,
        phone=(payload.get("phone") or ""),
        website=(payload.get("website") or ""),
        status="Registered",
        number_users_purchased=1,
        notes="",
        mail_list=False,
        entered_by=username,
        email_address=email,
        is_deleted=False,
        country_id=country_id,
    )

    db.session.add(tenant)
    db.session.flush()  # get tenant.id without full commit

    # Create user (store timestamps as naive UTC to match db.DateTime defaults)
    now = datetime.utcnow()
    user = User(
        id=str(tenant.id) + ":" + username,  # simple deterministic id
        user_name=username,
        normalized_user_name=username.upper(),
        email=email,
        normalized_email=email.upper(),
        email_confirmed=True,
        phone_number=(payload.get("phone") or ""),
        first_name=(payload.get("firstName") or "").strip(),
        last_name=(payload.get("lastName") or "").strip(),
        status="Active",
        tenant_id=tenant.id,
        is_deleted=False,
        date_entered=now,
        flask_password_hash=generate_password_hash(password),
    )

    db.session.add(user)
    db.session.commit()

    identity = user.id  # already a string: str(tenant.id) + ":" + username
    claims = {"username": user.user_name}

    access = create_access_token(identity=identity, additional_claims=claims)
    refresh = create_refresh_token(identity=identity, additional_claims=claims)
    
    # Store refresh token in database
    expiry_date = datetime.utcnow() + timedelta(days=7)
    refresh_token_record = RefreshToken(
        user_id=str(user.id),
        token=refresh,
        jwt_id="",  # Can be extracted from token if needed
        is_used=False,
        is_revoked=False,
        expiry_date=expiry_date,
    )
    db.session.add(refresh_token_record)
    db.session.commit()
    signup_country = Country.query.get(tenant.country_id) if tenant.country_id else None
    
    return jsonify(
        {
            "success": True,
            "status": "Success",
            "token": access,
            "refreshToken": refresh,
            "message": "User added successfully!",
            "data": {
                "tenantId": tenant.id,
                "userName": user.user_name,
                "email": user.email,
                "onboardingDemoEnabled": _is_onboarding_demo_enabled(),
                "countryDateFormat": signup_country.date_format if signup_country else None,
            },
        }
    )


@auth_bp.post("/signin")
def signin():
    """Sign in and issue JWTs (access + refresh).
    
    Based on the old system's AuthenticateController.SignIn endpoint.
    Validates user, tenant, email confirmation, and returns full user data.
    """
    payload = request.get_json(silent=True) or {}
    # For compatibility, accept both 'username' and 'userName' / 'userId'
    username = (
        payload.get("username")
        or payload.get("userName")
        or payload.get("userId")
        or ""
    )
    username = _normalize_username(username)
    password = payload.get("password") or ""

    if not username or not password:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Invalid signin payload"],
                }
            ),
            400,
        )

    # Dev/default Super Admin login independent of tenant records.
    if (
        username.lower() == DEFAULT_SUPER_ADMIN_USERNAME
        and password == DEFAULT_SUPER_ADMIN_PASSWORD
    ):
        claims = {
            "username": DEFAULT_SUPER_ADMIN_USERNAME,
            "role": "SuperAdministrator",
        }
        access = create_access_token(
            identity=DEFAULT_SUPER_ADMIN_IDENTITY,
            additional_claims=claims,
        )
        refresh = create_refresh_token(
            identity=DEFAULT_SUPER_ADMIN_IDENTITY,
            additional_claims=claims,
        )

        expiry_date = datetime.utcnow() + timedelta(days=7)
        refresh_token_record = RefreshToken(
            user_id=DEFAULT_SUPER_ADMIN_IDENTITY,
            token=refresh,
            jwt_id="",
            is_used=False,
            is_revoked=False,
            expiry_date=expiry_date,
        )
        db.session.add(refresh_token_record)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "token": access,
                "refreshToken": refresh,
                "data": {
                    "userName": DEFAULT_SUPER_ADMIN_USERNAME,
                    "firstName": "Super",
                    "lastName": "Admin",
                    "roleName": "SuperAdministrator",
                    "tenantId": 0,
                    "tenantName": "Super Admin",
                    "countryId": 0,
                    "countryName": "",
                    "countryISO2Code": "",
                },
            }
        )

    # Find user by username
    user = User.query.filter(
        db.func.lower(User.user_name) == username.lower()
    ).first()

    # Check if user exists and has TenantId > 0 (matching old system check)
    if not user or not user.tenant_id or user.tenant_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Invalid credentials."],
                }
            ),
            400,
        )

    # Check password (using Flask password hash)
    if not user.flask_password_hash:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": [
                        "User does not have a Flask password set yet. Please reset your password."
                    ],
                }
            ),
            400,
        )

    if not check_password_hash(user.flask_password_hash, password):
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Invalid credentials."],
                }
            ),
            400,
        )

    # Check if tenant is deleted
    tenant = Tenant.query.filter_by(id=user.tenant_id).first()
    if not tenant or tenant.is_deleted:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Unauthorized! Rescue has locked. Please contact site administrator."],
                }
            ),
            400,
        )

    # Check if email is confirmed
    if not user.email_confirmed:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Check your email to verify your email address."],
                }
            ),
            400,
        )

    # Check if user is deleted
    if user.is_deleted:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["User is not valid."],
                }
            ),
            400,
        )

    # Check if user status is active
    if (user.status or "").lower() != "active":
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["User is not active."],
                }
            ),
            400,
        )

    role_name = _get_role_name_for_user(user.id)
    # Default to Administrator if no role found (matching old system behavior)
    if not role_name:
        role_name = "Administrator"

    # Get country information
    country_id = tenant.country_id or 0
    country_name = ""
    country_iso2_code = ""
    country_date_format = None
    
    if country_id and country_id > 0:
        country = Country.query.get(country_id)
        if country:
            country_name = country.country_name or ""
            country_iso2_code = country.iso2_code or ""
            country_date_format = country.date_format

    # Get tenant name
    tenant_name = tenant.name or ""

    # Generate JWT tokens
    identity = user.id
    claims = {
        "username": user.user_name,
        "role": role_name,
        "roleName": role_name,
    }
    access = create_access_token(identity=identity, additional_claims=claims)
    refresh = create_refresh_token(identity=identity, additional_claims=claims)
    
    # Store refresh token in database
    expiry_date = datetime.utcnow() + timedelta(days=7)
    refresh_token_record = RefreshToken(
        user_id=str(user.id),
        token=refresh,
        jwt_id="",  # Can be extracted from token if needed
        is_used=False,
        is_revoked=False,
        expiry_date=expiry_date,
    )
    db.session.add(refresh_token_record)
    db.session.commit()

    # Return response matching old system's AuthResponse format
    return jsonify(
        {
            "success": True,
            "token": access,
            "refreshToken": refresh,
            "data": {
                "userName": user.user_name or "",
                "firstName": user.first_name or "",
                "lastName": user.last_name or "",
                "roleName": role_name,
                "tenantId": user.tenant_id,
                "tenantName": tenant_name,
                "countryId": country_id,
                "countryName": country_name,
                "countryISO2Code": country_iso2_code,
                "countryDateFormat": country_date_format,
            },
        }
    )


@auth_bp.post("/refresh-token")
def refresh_token():
    """Equivalent of POST api/authenticate/refresh-token.
    
    Accepts token and refreshToken in the request body.
    Validates the refresh token and generates a new access token.
    
    Request body:
    {
        "token": "current_access_token",
        "refreshToken": "refresh_token_string"
    }
    
    Response:
    {
        "success": true,
        "token": "new_access_token",
        "refreshToken": "new_refresh_token"
    }
    """
    payload = request.get_json(silent=True) or {}
    token = payload.get("token", "").strip()
    refresh_token_str = payload.get("refreshToken", "").strip()
    
    if not token or not refresh_token_str:
        return jsonify(
            {
                "success": False,
                "errors": ["Token and refreshToken are required."],
            }
        ), 400
    
    try:
        # Try to decode the refresh token to get user identity
        # First, try to verify it as a refresh token
        try:
            decoded = decode_token(refresh_token_str)
            if decoded.get("type") != "refresh":
                return jsonify(
                    {
                        "success": False,
                        "errors": ["Invalid refresh token."],
                    }
                ), 400
            
            user_id = decoded.get("sub")
            if not user_id:
                return jsonify(
                    {
                        "success": False,
                        "errors": ["Invalid token payload."],
                    }
                ), 400
            
            # Check if refresh token exists in database and is valid
            refresh_token_record = RefreshToken.query.filter(
                RefreshToken.token == refresh_token_str,
                RefreshToken.is_used.is_(False),
                RefreshToken.is_revoked.is_(False),
                RefreshToken.expiry_date > datetime.utcnow(),
            ).first()
            
            if not refresh_token_record:
                return jsonify(
                    {
                        "success": False,
                        "errors": ["Invalid or expired refresh token."],
                    }
                ), 400
            
            # Verify user exists and is active, except for default Super Admin identity.
            user = None
            if user_id != DEFAULT_SUPER_ADMIN_IDENTITY:
                user = User.query.get(user_id)
                if not user or user.is_deleted or (user.status or "").lower() != "active":
                    return jsonify(
                        {
                            "success": False,
                            "errors": ["User not found or inactive."],
                        }
                    ), 400
            
            # Mark old refresh token as used
            refresh_token_record.is_used = True
            db.session.commit()
            
            # Generate new tokens
            if user_id == DEFAULT_SUPER_ADMIN_IDENTITY:
                identity = DEFAULT_SUPER_ADMIN_IDENTITY
                claims = {
                    "username": DEFAULT_SUPER_ADMIN_USERNAME,
                    "role": "SuperAdministrator",
                }
            else:
                identity = user.id
                role_name = _get_role_name_for_user(user.id) or "Administrator"
                claims = {
                    "username": user.user_name,
                    "role": role_name,
                    "roleName": role_name,
                }
            new_access_token = create_access_token(identity=identity, additional_claims=claims)
            new_refresh_token = create_refresh_token(identity=identity, additional_claims=claims)
            
            # Store new refresh token in database
            # Calculate expiry (typically 7 days for refresh tokens)
            expiry_date = datetime.utcnow() + timedelta(days=7)
            new_refresh_token_record = RefreshToken(
                user_id=str(identity),
                token=new_refresh_token,
                jwt_id="",  # Can be extracted from token if needed
                is_used=False,
                is_revoked=False,
                expiry_date=expiry_date,
            )
            db.session.add(new_refresh_token_record)
            db.session.commit()
            
            return jsonify(
                {
                    "success": True,
                    "token": new_access_token,
                    "refreshToken": new_refresh_token,
                }
            )
            
        except Exception as decode_error:
            # If decoding fails, token is invalid
            return jsonify(
                {
                    "success": False,
                    "errors": ["Invalid refresh token."],
                }
            ), 400
            
    except Exception as ex:
        db.session.rollback()
        return jsonify(
            {
                "success": False,
                "errors": [f"Token refresh failed: {str(ex)}"],
            }
        ), 400


@auth_bp.post("/set-password")
@jwt_required(optional=True)
def set_password():
    """Helper endpoint to set a Flask-specific password for a user id/username.

    This is intended for migration/dev and should be locked down in production.
    """
    payload = request.get_json(silent=True) or {}
    username = _normalize_username(payload.get("username") or "")
    password = payload.get("password") or ""

    if not username or not password:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["username and password required"],
                }
            ),
            400,
        )

    user = User.query.filter(
        db.func.lower(User.user_name) == username.lower()
    ).first()
    if not user:
        return (
            jsonify({"success": False, "errors": ["User not found"]}),
            404,
        )

    user.flask_password_hash = generate_password_hash(password)
    user.date_entered = user.date_entered or datetime.utcnow()
    db.session.commit()

    return jsonify({"success": True, "message": "Password set for user."})


@auth_bp.post("/forgot-username")
def forgot_username():
    """Send username reminder to email (stubbed: just returns a success message)."""
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip()
    if not email:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Email address required.",
                }
            ),
            400,
        )

    # In a full implementation we'd send an email here.
    return jsonify(
        {
            "success": True,
            "message": "If an account exists for this email, we have sent the User ID.",
        }
    )


@auth_bp.post("/forgot-password")
def forgot_password():
    """Start password reset flow (stubbed)."""
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip()

    if not email:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Email address required.",
                }
            ),
            400,
        )

    # Real implementation would create a reset token and send an email.
    return jsonify(
        {
            "success": True,
            "message": "If an account exists for this email, a reset link has been sent.",
        }
    )


@auth_bp.post("/reset-password")
def reset_password():
    """Reset password directly, given email and new password.

    This is a simplified version that trusts the caller; in production
    you should verify a time-limited reset token.
    """
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip()
    password = payload.get("password") or ""

    if not email or not password:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Email and new password are required.",
                }
            ),
            400,
        )

    user = User.query.filter(db.func.lower(User.email) == email.lower()).first()
    if not user:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "User does not exist.",
                }
            ),
            404,
        )

    user.flask_password_hash = generate_password_hash(password)
    db.session.commit()

    return jsonify({"success": True, "message": "Password updated successfully!"})


@auth_bp.get("/check-email-available")
def check_email_available():
    email = (request.args.get("email") or "").strip()
    if not email:
        return (
            jsonify(
                {
                    "success": False,
                    "status": "Error",
                    "message": "Email address required!",
                }
            ),
            400,
        )

    user = User.query.filter(db.func.lower(User.email) == email.lower()).first()
    if user:
        return jsonify(
            {
                "success": False,
                "status": "Success",
                "message": "Email not available!",
            }
        )

    return jsonify(
        {
            "success": True,
            "status": "Success",
            "message": "Email available!",
        }
    )


@auth_bp.get("/check-username-available")
def check_username_available():
    username = _normalize_username(request.args.get("username") or "")
    if not username:
        return (
            jsonify(
                {
                    "success": False,
                    "status": "Error",
                    "message": "Username required!",
                }
            ),
            400,
        )

    user = User.query.filter(
        db.func.lower(User.user_name) == username.lower()
    ).first()
    if user:
        return jsonify(
            {
                "success": False,
                "status": "Success",
                "message": "Username not available!",
            }
        )

    return jsonify(
        {
            "success": True,
            "status": "Success",
            "message": "Username available!",
        }
    )


@auth_bp.get("/check-rescue-available")
def check_rescue_available():
    rescue_name = (request.args.get("rescueName") or "").strip()
    state = (request.args.get("state") or "").strip()
    country_id = request.args.get("countryId", default=0, type=int)

    if not rescue_name:
        return (
            jsonify(
                {
                    "success": False,
                    "status": "Error",
                    "message": "Rescue name required!",
                }
            ),
            400,
        )

    tenant = (
        Tenant.query.filter(db.func.lower(Tenant.name) == rescue_name.lower())
        .filter(db.func.lower(Tenant.state) == state.lower())
        .filter(Tenant.country_id == country_id)
        .first()
    )

    if tenant:
        return jsonify(
            {
                "success": False,
                "status": "Success",
                "message": "Rescue not available!",
            }
        )

    return jsonify(
        {
            "success": True,
            "status": "Success",
            "message": "Rescue available!",
        }
    )

