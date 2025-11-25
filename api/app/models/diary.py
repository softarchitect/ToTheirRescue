from datetime import datetime

from ..extensions import db


class Diary(db.Model):
    __tablename__ = "Diary"

    id = db.Column("Id", db.Integer, primary_key=True)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False)
    tenant_or_animal = db.Column("TenantOrAnimal", db.String(60), nullable=False)
    action_date = db.Column("ActionDate", db.DateTime, nullable=False)
    notes = db.Column("Notes", db.String(4000))
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    animal = db.Column("Animal", db.String(100), nullable=False)



