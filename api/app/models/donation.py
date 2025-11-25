from datetime import datetime

from ..extensions import db


class Donation(db.Model):
    """Mapping of the Donations table."""

    __tablename__ = "Donations"

    id = db.Column("Id", db.Integer, primary_key=True)

    pco_id = db.Column("PcoId", db.Integer, nullable=True)
    donation_date = db.Column("DonationDate", db.DateTime)
    amount = db.Column("Amount", db.Float, default=0.0)
    donation_type = db.Column("DonationType", db.String(30), default="")
    notes = db.Column("Notes", db.String(2000))

    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(256), default="")
    modified_by = db.Column("ModifiedBy", db.String(256), default="")
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False)
    tenant_id = db.Column("TenantId", db.Integer)

    def to_dict_basic(self, donor_name: str | None = None) -> dict:
        return {
            "id": str(self.id),
            "donorId": str(self.pco_id) if self.pco_id is not None else "",
            "donorName": donor_name or "",
            "amount": float(self.amount or 0.0),
            "date": (self.donation_date or self.date_entered or datetime.utcnow()).date().isoformat(),
            "type": (self.donation_type or "one-time").lower(),
            "purpose": self.notes or None,
        }


