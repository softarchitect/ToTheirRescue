import random
from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import OTP
from ..email import send_verification_email

otp_bp = Blueprint("otp", __name__)


def _get_param(name: str, payload: dict) -> str:
    """Read from either query string or JSON body."""
    return (request.args.get(name) or payload.get(name) or "").strip()


@otp_bp.post("/otp-generate")
def otp_generate():
    """Generate an email OTP and (in a real deployment) send it by email.

    Compatible with old API signature:
      POST /api/otp/otp-generate?email=...&firstName=...

    Also accepts JSON body: { "email": "...", "firstName": "..." }.
    """
    payload = request.get_json(silent=True) or {}
    email = _get_param("email", payload)
    first_name = _get_param("firstName", payload)

    if not email:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Email is required"],
                }
            ),
            400,
        )

    # Generate a 6-digit numeric OTP
    code = f"{random.randint(0, 999999):06d}"

    otp = OTP(
        otp_code=code,
        email=email,
        is_email_otp_verified=False,
        # Use UTC naive datetimes to match SQLAlchemy's db.DateTime default (datetime.utcnow)
        date_entered=datetime.utcnow(),
        entered_by=email,
    )
    db.session.add(otp)
    db.session.commit()

    # Send the code via email (if SENDGRID_API_KEY is configured).
    email_sent = send_verification_email(first_name or None, email, code)

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Verification code sent." if email_sent else "Verification code generated.",
            "data": {
                "email": email,
                "firstName": first_name or None,
                "code": code if request.args.get("debug") == "true" else None,
            },
        }
    )


@otp_bp.post("/otp-verify")
def otp_verify():
    """Verify an email OTP.

    Compatible with old API signature:
      POST /api/otp/otp-verify?email=...&otp=...

    Also accepts JSON body: { "email": "...", "otp": "123456" }.
    """
    payload = request.get_json(silent=True) or {}
    email = _get_param("email", payload)
    code = _get_param("otp", payload)

    if not email:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Email is required"],
                }
            ),
            400,
        )

    if not code:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Verification code is required"],
                }
            ),
            400,
        )

    # Get the most recent OTP for this email
    record: OTP | None = (
        OTP.query.filter_by(email=email)
        .order_by(OTP.date_entered.desc())
        .first()
    )

    if not record:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["No verification code found for this email."],
                }
            ),
            400,
        )

    # Optional expiry check (e.g. 15 minutes)
    # Use UTC naive datetimes on both sides to avoid naive/aware comparison issues.
    if record.date_entered and datetime.utcnow() - record.date_entered > timedelta(
        minutes=15
    ):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Verification code has expired. Please request a new one."],
                }
            ),
            400,
        )

    if record.otp_code != code:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Invalid verification code."],
                }
            ),
            400,
        )

    record.is_email_otp_verified = True
    record.date_modified = datetime.utcnow()
    record.modified_by = email
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Email verified successfully.",
        }
    )


