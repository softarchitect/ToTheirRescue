from datetime import datetime

from ..extensions import db


class Medicine(db.Model):
    __tablename__ = "Medicines"

    id = db.Column("Id", db.Integer, primary_key=True)
    medicine_name = db.Column("MedicineName", db.String(510), nullable=False)
    used_for = db.Column("UsedFor", db.String(512), nullable=False)
    formulation = db.Column("Formulation", db.Text, nullable=False)
    monthly_med = db.Column("MonthlyMed", db.Boolean, default=False, nullable=False)
    notes = db.Column("Notes", db.Text)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)



