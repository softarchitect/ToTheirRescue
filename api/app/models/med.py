from datetime import datetime

from ..extensions import db


class Med(db.Model):
    __tablename__ = "Meds"

    id = db.Column("Id", db.Integer, primary_key=True)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False)
    medicine_id = db.Column("MedicineId", db.Integer, nullable=False)
    # Free-text name for one-off medicines that aren't in the tenant's
    # Customization catalog; medicine_id is 0 in that case.
    medicine_name = db.Column("MedicineName", db.String(150))
    administered_date = db.Column("AdministeredDate", db.DateTime)
    due_date = db.Column("DueDate", db.DateTime)
    notes = db.Column("Notes", db.String(4000))
    administered_by = db.Column("AdministeredBy", db.String(150))
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    reminder = db.Column("Reminder", db.Boolean, default=False, nullable=False)
    clinic = db.Column("Clinic", db.String(150))
    dosage = db.Column("Dosage", db.String(100))
    prescription_record_no = db.Column("PrescriptionRecordNo", db.Integer, nullable=False)
    veterinarian = db.Column("Veterinarian", db.String(100))



