from datetime import datetime

from ..extensions import db


class SOAP(db.Model):
    __tablename__ = "SOAPs"

    id = db.Column("Id", db.Integer, primary_key=True)
    action_date = db.Column("ActionDate", db.DateTime, nullable=False)
    subjective = db.Column("Subjective", db.String(8000), nullable=False)
    objective = db.Column("Objective", db.String(8000), nullable=False)
    assessment = db.Column("Assessment", db.String(8000), nullable=False)
    soap_plan = db.Column("SOAPPlan", db.String(8000), nullable=False)
    veterinarian = db.Column("Veterinarian", db.String(150), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    hospital_clinic_id = db.Column("HospitalClinicId", db.Integer, nullable=False)



