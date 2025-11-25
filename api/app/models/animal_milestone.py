from datetime import datetime

from ..extensions import db


class AnimalMilestone(db.Model):
    __tablename__ = "AnimalMilestones"

    id = db.Column("Id", db.Integer, primary_key=True)
    milestone_type = db.Column("MilestoneType", db.String(50), nullable=False)
    milestone_date = db.Column("MilestoneDate", db.DateTime, nullable=False)
    other_rescue_id_no = db.Column("OtherRescueIDNo", db.String(50), nullable=False)
    amount_paid_fee = db.Column("AmountPaidFee", db.Numeric(10, 2), default=0)
    amount_received_fee = db.Column("AmountReceivedFee", db.Numeric(10, 2), default=0)
    notes = db.Column("Notes", db.String(8000))
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    acquisition_way_id = db.Column("AcquisitionWayId", db.Integer, nullable=False)
    pco_id = db.Column("PcoId", db.Integer, nullable=False)
    animal_id = db.Column("AnimalId", db.Integer, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)
    acquisition_way_name = db.Column("AcquisitionWayName", db.String(150), nullable=False)
    other_rescue_shelter_id = db.Column("OtherRescueShelterId", db.Integer, nullable=False)
    is_approx_dob = db.Column("IsApproxDOB", db.Boolean, default=False, nullable=False)



