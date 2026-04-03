from datetime import datetime

from ..extensions import db


class SystemSetting(db.Model):
    __tablename__ = "SystemSettings"

    id = db.Column("Id", db.Integer, primary_key=True)
    key = db.Column("Key", db.String(120), nullable=False, unique=True)
    bool_value = db.Column("BoolValue", db.Boolean, nullable=False, default=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
