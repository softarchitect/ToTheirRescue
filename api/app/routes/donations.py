from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Donation, PCO, User

donations_bp = Blueprint("donations", __name__)


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


@donations_bp.get("/get-donation")
@jwt_required(optional=True)
def get_donations_by_pco():
    """Equivalent of GET api/donation/get-donation?pcoId=...
    
    Returns donations for a specific PCO along with total donation amount.
    """
    try:
        pco_id = request.args.get("pcoId", type=int)
        if not pco_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Person identifier required."],
                    }
                ),
                400,
            )
        
        tenant_id = _get_tenant_id_from_jwt()
        
        # Build query
        query = Donation.query.filter(
            Donation.pco_id == pco_id,
            Donation.is_deleted.is_(False),
        )
        
        # Filter by tenant if authenticated
        if tenant_id:
            query = query.filter(Donation.tenant_id == tenant_id)
        
        donations = (
            query.order_by(Donation.donation_date.desc().nullslast(), Donation.id.desc())
            .all()
        )

        donor = PCO.query.get(pco_id)
        donor_name = f"{donor.first_name} {donor.last_name}".strip() if donor else ""

        data = [d.to_dict_basic(donor_name=donor_name) for d in donations]
        
        # Calculate total amount (only for money donations)
        total_amount = sum(
            float(d.amount or 0.0) 
            for d in donations 
            if (d.donation_type or "").lower() == "money"
        )

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Donations retrieved successfully",
                "data": {
                    "donations": data,
                    "totalCount": total_amount,  # Total amount for money donations
                },
            }
        )
    except Exception as ex:
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": [
                    "Oops! Something went wrong while getting donations",
                    str(ex),
                ],
            }
        ), 400


@donations_bp.post("/update-donation/<int:donation_id>")
@donations_bp.put("/update-donation/<int:donation_id>")
@jwt_required(optional=True)
def update_donation(donation_id):
    """Equivalent of POST api/donation/update-donation/{id}.
    
    Updates an existing donation.
    
    Request body:
      - amount: Donation amount (required)
      - date: Donation date (ISO format, optional)
      - donationType/type: Donation type - "money" or "other" (optional)
      - notes: Notes/purpose (optional)
    """
    try:
        if donation_id <= 0:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Donation identifier must be greater than 0"],
                    }
                ),
                400,
            )
        
        payload = request.get_json(silent=True) or {}
        
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
        
        # Find the donation
        donation = Donation.query.filter(
            Donation.id == donation_id,
            Donation.tenant_id == tenant_id,
            Donation.is_deleted.is_(False)
        ).first()
        
        if not donation:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Donation not found."],
                    }
                ),
                400,
            )
        
        # Update fields
        if "amount" in payload:
            donation.amount = float(payload.get("amount"))
        
        # Parse donation type
        if "donationType" in payload or "type" in payload:
            donation_type = (payload.get("donationType") or payload.get("type") or "money").lower()
            if donation_type not in ["money", "other", "others"]:
                donation_type = "money"
            if donation_type == "others":
                donation_type = "other"
            donation.donation_type = donation_type[:30]
        
        # Update date
        if "date" in payload or "donationDate" in payload:
            date_str = payload.get("date") or payload.get("donationDate")
            if date_str:
                try:
                    donation.donation_date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                except:
                    try:
                        donation.donation_date = datetime.fromisoformat(date_str)
                    except:
                        pass
        
        # Update notes
        if "notes" in payload or "purpose" in payload:
            donation.notes = (payload.get("notes") or payload.get("purpose") or "").strip()[:2000]
        
        donation.modified_by = username or "system"
        donation.date_modified = datetime.utcnow()
        
        db.session.commit()
        
        donor = PCO.query.get(donation.pco_id)
        donor_name = f"{donor.first_name} {donor.last_name}".strip() if donor else ""

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Donation updated successfully",
                "data": donation.to_dict_basic(donor_name=donor_name),
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
                        "Oops! Something went wrong while updating donation",
                        str(ex),
                    ],
                }
            ),
            400,
        )


@donations_bp.patch("/delete-donation/<int:donation_id>")
@donations_bp.delete("/delete-donation/<int:donation_id>")
@jwt_required(optional=True)
def delete_donation(donation_id):
    """Equivalent of PATCH api/donation/delete-donation/{id}.
    
    Soft deletes a donation by setting is_deleted=True.
    """
    try:
        if donation_id <= 0:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Donation identifier must be greater than 0"],
                    }
                ),
                400,
            )
        
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
        
        # Find the donation
        donation = Donation.query.filter(
            Donation.id == donation_id,
            Donation.tenant_id == tenant_id,
            Donation.is_deleted.is_(False)
        ).first()
        
        if not donation:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Donation not found."],
                    }
                ),
                400,
            )
        
        # Soft delete the donation
        donation.is_deleted = True
        donation.date_modified = datetime.utcnow()
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                donation.modified_by = user.user_name or "system"
        
        db.session.commit()
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Donation deleted successfully",
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
                        "Oops! Something went wrong while deleting donation",
                        str(ex),
                    ],
                }
            ),
            400,
        )

        donor = PCO.query.get(pco_id)
        donor_name = f"{donor.first_name} {donor.last_name}".strip() if donor else ""

        data = [d.to_dict_basic(donor_name=donor_name) for d in donations]
        
        # Calculate total amount (only for money donations)
        total_amount = sum(
            float(d.amount or 0.0) 
            for d in donations 
            if (d.donation_type or "").lower() == "money"
        )

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Donations retrieved successfully",
                "data": {
                    "donations": data,
                    "totalCount": total_amount,  # Total amount for money donations
                },
            }
        )
    except Exception as ex:
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": [
                    "Oops! Something went wrong while getting donations",
                    str(ex),
                ],
            }
        ), 400


@donations_bp.post("/add-donation")
@jwt_required(optional=True)
def add_donation():
    """Equivalent of POST api/donation/add-donation.
    
    Creates a new donation for a PCO.
    
    Request body:
      - pcoId: PCO identifier (required)
      - amount: Donation amount (required)
      - date: Donation date (ISO format, optional, defaults to now)
      - type: Donation type - "money" or "other" (optional, defaults to "money")
      - notes: Notes/purpose (optional)
    """
    try:
        payload = request.get_json(silent=True) or {}
        pco_id = payload.get("pcoId")
        amount = payload.get("amount")

        if not pco_id or amount is None:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["pcoId and amount are required"],
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
        
        # Validate PCO exists
        pco = PCO.query.filter(
            PCO.id == pco_id,
            PCO.tenant_id == tenant_id,
            PCO.is_deleted.is_(False)
        ).first()
        
        if not pco:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["PCO not found."],
                    }
                ),
                400,
            )
        
        # Parse donation type
        donation_type = (payload.get("donationType") or payload.get("type") or "money").lower()
        if donation_type not in ["money", "other", "others"]:
            donation_type = "money"
        if donation_type == "others":
            donation_type = "other"
        
        # Parse date
        donation_date = datetime.utcnow()
        if payload.get("date"):
            try:
                donation_date = datetime.fromisoformat(payload["date"].replace("Z", "+00:00"))
            except:
                try:
                    donation_date = datetime.fromisoformat(payload["date"])
                except:
                    pass
        
        # Parse donationDate if provided (alternative field name)
        if payload.get("donationDate"):
            try:
                donation_date = datetime.fromisoformat(payload["donationDate"].replace("Z", "+00:00"))
            except:
                try:
                    donation_date = datetime.fromisoformat(payload["donationDate"])
                except:
                    pass

        donation = Donation(
            pco_id=int(pco_id),
            amount=float(amount),
            donation_type=donation_type[:30],
            donation_date=donation_date,
            notes=(payload.get("notes") or payload.get("purpose") or "").strip()[:2000],
            tenant_id=tenant_id,
            entered_by=username or "system",
            date_entered=datetime.utcnow(),
        )
        db.session.add(donation)
        db.session.commit()

        donor = PCO.query.get(donation.pco_id)
        donor_name = f"{donor.first_name} {donor.last_name}".strip() if donor else ""

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Donation created successfully",
                "data": donation.to_dict_basic(donor_name=donor_name),
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
                        "Oops! Something went wrong while creating donation",
                        str(ex),
                    ],
                }
            ),
            400,
        )


