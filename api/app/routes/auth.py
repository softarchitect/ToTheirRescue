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
from ..models import User, Tenant, OTP
from ..models.refresh_token import RefreshToken

auth_bp = Blueprint("auth", __name__)


def _normalize_username(value: str) -> str:
    return (value or "").strip()


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

    # Ensure email OTP has been verified recently
    verified_otp = (
        OTP.query.filter_by(email=email, is_email_otp_verified=True)
        .order_by(OTP.date_modified.desc())
        .first()
    )
    if not verified_otp:
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

    # Create tenant
    tenant = Tenant(
        name=org_name,
        tenant_acronym=(payload.get("acronym") or "").strip(),
        street=(payload.get("street") or "").strip(),
        city=(payload.get("city") or "").strip(),
        state=(payload.get("state") or "").strip(),
        zip="",
        phone=(payload.get("phone") or ""),
        website=(payload.get("website") or ""),
        status="Registered",
        number_users_purchased=1,
        notes="",
        mail_list=False,
        entered_by=username,
        email_address=email,
        is_deleted=False,
        country_id=0,  # new UI only has free-text country; we default id to 0
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
            },
        }
    )


@auth_bp.post("/signin")
def signin():
    """Sign in and issue JWTs (access + refresh)."""
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

    user = User.query.filter(
        db.func.lower(User.user_name) == username.lower()
    ).first()

    if not user or user.is_deleted or (user.status or "").lower() != "active":
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Invalid credentials."],
                }
            ),
            400,
        )

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

    identity = user.id
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

    return jsonify(
        {
            "success": True,
            "message": "Sign in successful",
            "token": access,
            "refreshToken": refresh,
            "data": {
                "userName": user.user_name,
                "email": user.email,
                "tenantId": user.tenant_id,
                # place-holders for compatibility with old shape
                "roleName": "Administrator",
                "countryCode": None,
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
            
            # Verify user exists and is active
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
            identity = user.id
            claims = {"username": user.user_name}
            new_access_token = create_access_token(identity=identity, additional_claims=claims)
            new_refresh_token = create_refresh_token(identity=identity, additional_claims=claims)
            
            # Store new refresh token in database
            # Calculate expiry (typically 7 days for refresh tokens)
            expiry_date = datetime.utcnow() + timedelta(days=7)
            new_refresh_token_record = RefreshToken(
                user_id=str(user.id),
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

