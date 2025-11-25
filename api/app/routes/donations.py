from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Donation, PCO

donations_bp = Blueprint("donations", __name__)


@donations_bp.get("/get-donation")
@jwt_required(optional=True)
def get_donations_by_pco():
    """Subset of GET api/donation/get-donation?pcoId=..."""
    pco_id = request.args.get("pcoId", type=int)
    if not pco_id:
        return (
            jsonify(
                {
                    "success": False,
                    "errors": ["Person identifier required."],
                }
            ),
            400,
        )

    donations = (
        Donation.query.filter(
            Donation.pco_id == pco_id,
            Donation.is_deleted.is_(False),
        )
        .order_by(Donation.donation_date.desc().nullslast(), Donation.id.desc())
        .all()
    )

    donor = PCO.query.get(pco_id)
    donor_name = f"{donor.first_name} {donor.last_name}".strip() if donor else ""

    data = [d.to_dict_basic(donor_name=donor_name) for d in donations]

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Donations retrieved successfully",
            "data": {"donations": data},
        }
    )


@donations_bp.post("/add-donation")
@jwt_required(optional=True)
def add_donation():
    """Create a new donation (similar to POST api/donation/add-donation)."""
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

    donation = Donation(
        pco_id=int(pco_id),
        amount=float(amount),
        donation_type=(payload.get("type") or "one-time")[:30],
        donation_date=datetime.fromisoformat(payload["date"])
        if payload.get("date")
        else datetime.utcnow(),
        notes=(payload.get("purpose") or "").strip(),
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


