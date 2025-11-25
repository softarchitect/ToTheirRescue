from datetime import datetime

from ..extensions import db


class SAAnimalType(db.Model):
    __tablename__ = "SAAnimalTypes"

    id = db.Column("Id", db.Integer, primary_key=True)
    type_name = db.Column("TypeName", db.String(50), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)



