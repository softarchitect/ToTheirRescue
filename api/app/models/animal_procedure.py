from datetime import datetime

from ..extensions import db


class AnimalProcedure(db.Model):
    __tablename__ = "AnimalProcedures"

    id = db.Column("Id", db.Integer, primary_key=True)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False)
    kind_id = db.Column("KindId", db.Integer, nullable=False)
    reminder = db.Column("Reminder", db.Boolean, default=False, nullable=False)
    due_date = db.Column("DueDate", db.DateTime)
    action_date = db.Column("ActionDate", db.DateTime)
    weight = db.Column("Weight", db.String(40))
    administerer = db.Column("Administerer", db.String(150))
    results = db.Column("Results", db.String(512))
    microchip_number = db.Column("MicrochipNumber", db.String(100))
    notes = db.Column("Notes", db.String(4000))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    hospital_clinic_id = db.Column("HospitalClinicId", db.Integer, nullable=False)



