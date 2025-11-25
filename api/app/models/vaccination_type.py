from datetime import datetime

from ..extensions import db


class VaccinationType(db.Model):
    __tablename__ = "VaccinationTypes"

    id = db.Column("Id", db.Integer, primary_key=True)
    kind = db.Column("Kind", db.String(300), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    animal_type_id = db.Column("AnimalTypeId", db.Integer, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)



