from datetime import datetime

from ..extensions import db


class Behavior(db.Model):
    __tablename__ = "Behaviors"

    id = db.Column("Id", db.Integer, primary_key=True)
    animal_type_id = db.Column("AnimalTypeId", db.Integer, nullable=False)
    behavior_name = db.Column("BehaviorName", db.String(150), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    modified_by = db.Column("ModifiedBy", db.String(512))



