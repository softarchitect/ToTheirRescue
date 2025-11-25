from datetime import datetime

from ..extensions import db


class VolunteerPersonActivity(db.Model):
    __tablename__ = "VolunteerPersonActivities"

    id = db.Column("Id", db.Integer, primary_key=True)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    pco_id = db.Column("PcoId", db.Integer, nullable=False)
    volunteer_activity_id = db.Column("VolunteerActivityId", db.Integer, nullable=False)



