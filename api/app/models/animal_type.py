from datetime import datetime

from ..extensions import db


class AnimalType(db.Model):
    __tablename__ = "AnimalTypes"

    id = db.Column("Id", db.Integer, primary_key=True)
    type_name = db.Column("TypeName", db.String(50), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    modified_by = db.Column("ModifiedBy", db.String(512))
    role_name = db.Column("RoleName", db.String(512))



