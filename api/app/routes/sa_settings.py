from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from ..extensions import db
from ..models import AspNetRole, AspNetUserRole, SystemSetting


sa_settings_bp = Blueprint("sa_settings", __name__)

ONBOARDING_DEMO_SETTING_KEY = "onboarding_demo_enabled"


def _get_username_from_jwt() -> str:
    claims = get_jwt()
    return (claims.get("username") or "").strip()


def _check_super_admin() -> bool:
    claims = get_jwt()
    role_name = (claims.get("role") or claims.get("roleName") or "").strip()
    if role_name == "SuperAdministrator":
        return True

    username = (claims.get("username") or "").strip().lower()
    identity = str(get_jwt_identity() or "")
    if username == "superadmin" or identity == "superadmin:local":
        return True

    user_role = (
        db.session.query(AspNetUserRole, AspNetRole)
        .join(AspNetRole, AspNetUserRole.role_id == AspNetRole.id)
        .filter(AspNetUserRole.user_id == identity)
        .first()
    )

    return bool(user_role and user_role[1].name == "SuperAdministrator")


@sa_settings_bp.get("/get-onboarding-demo-setting")
@jwt_required()
def get_onboarding_demo_setting():
    if not _check_super_admin():
        return jsonify(
            {
                "success": False,
                "statusCode": 403,
                "errors": ["Access denied. Super Administrator role required."],
            }
        ), 403

    setting = SystemSetting.query.filter(
        SystemSetting.key == ONBOARDING_DEMO_SETTING_KEY,
        SystemSetting.is_deleted.is_(False),
    ).first()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "SUCCESS",
            "data": {
                "enabled": bool(setting.bool_value) if setting else False,
            },
        }
    )


@sa_settings_bp.post("/update-onboarding-demo-setting")
@jwt_required()
def update_onboarding_demo_setting():
    if not _check_super_admin():
        return jsonify(
            {
                "success": False,
                "statusCode": 403,
                "errors": ["Access denied. Super Administrator role required."],
            }
        ), 403

    payload = request.get_json(silent=True) or {}
    enabled = bool(payload.get("enabled", False))
    username = _get_username_from_jwt() or "superadmin"

    try:
        setting = SystemSetting.query.filter(
            SystemSetting.key == ONBOARDING_DEMO_SETTING_KEY,
            SystemSetting.is_deleted.is_(False),
        ).first()

        if setting:
            setting.bool_value = enabled
            setting.modified_by = username
            setting.date_modified = datetime.utcnow()
        else:
            setting = SystemSetting(
                key=ONBOARDING_DEMO_SETTING_KEY,
                bool_value=enabled,
                entered_by=username,
                modified_by=username,
                date_entered=datetime.utcnow(),
                date_modified=datetime.utcnow(),
                is_deleted=False,
            )
            db.session.add(setting)

        db.session.commit()
    except Exception as ex:
        db.session.rollback()
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": [f"Unable to update onboarding demo setting: {str(ex)}"],
            }
        ), 400

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Onboarding demo setting updated successfully.",
            "data": {"enabled": enabled},
        }
    )
