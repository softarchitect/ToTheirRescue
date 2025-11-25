from datetime import datetime

from ..extensions import db


class AcquisitionWay(db.Model):
    __tablename__ = "AcquisitionWay"

    id = db.Column("Id", db.Integer, primary_key=True)
    acquisition_way_name = db.Column("AcquisitionWayName", db.String(150), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    is_not_editable = db.Column("IsNotEditable", db.Boolean, default=False, nullable=False)
    tenant_id = db.Column("TenantId", db.Integer, nullable=False)



