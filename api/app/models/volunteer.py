from datetime import datetime

from ..extensions import db


class Volunteer(db.Model):
    __tablename__ = "Volunteers"

    id = db.Column("Id", db.Integer, primary_key=True)
    notes = db.Column("Notes", db.String(8000))
    active = db.Column("Active", db.Boolean, default=True, nullable=False)
    date_active = db.Column("DateActive", db.DateTime)
    date_inactive = db.Column("DateInactive", db.DateTime)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    pco_id = db.Column("PcoId", db.Integer, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)



