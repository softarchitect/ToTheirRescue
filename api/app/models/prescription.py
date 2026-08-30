from datetime import datetime

from ..extensions import db


class Prescription(db.Model):
    __tablename__ = "Prescriptions"

    id = db.Column("Id", db.Integer, primary_key=True)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False, index=True)
    prescription_text = db.Column("PrescriptionText", db.String(2000), nullable=False)
    clinic = db.Column("Clinic", db.String(150))
    veterinarian = db.Column("Veterinarian", db.String(100))
    special_instructions = db.Column("SpecialInstructions", db.String(4000))
    # Only populated when the duration came from the open-ended "Or" dropdown.
    duration = db.Column("Duration", db.String(100))
    start_date = db.Column("StartDate", db.DateTime)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False, index=True)
