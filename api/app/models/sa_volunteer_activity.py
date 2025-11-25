from datetime import datetime

from ..extensions import db


class SAVolunteerActivity(db.Model):
    __tablename__ = "SAVolunteerActivities"

    id = db.Column("Id", db.Integer, primary_key=True)
    sa_volunteer_activity_name = db.Column("SAVolunteerActivityName", db.String(150), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)



