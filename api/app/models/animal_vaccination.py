from datetime import datetime

from ..extensions import db


class AnimalVaccination(db.Model):
    __tablename__ = "AnimalVaccinations"

    id = db.Column("Id", db.Integer, primary_key=True)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False)
    kind_id = db.Column("KindId", db.Integer, nullable=False)
    reminder = db.Column("Reminder", db.Boolean, default=False, nullable=False)
    due_date = db.Column("DueDate", db.DateTime)
    action_date = db.Column("ActionDate", db.DateTime)
    administerer = db.Column("Administerer", db.String(150))
    tag_number = db.Column("TagNumber", db.String(100))
    vaccine_manufacturer = db.Column("VaccineManufacturer", db.String(512))
    vaccine_serial_no = db.Column("VaccineSerialNo", db.String(100))
    notes = db.Column("Notes", db.String(4000))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    hospital_clinic_id = db.Column("HospitalClinicId", db.Integer, nullable=True)
    due_again = db.Column("DueAgain", db.String(60))
    vacc_record_no = db.Column("VaccRecordNo", db.String(60))



