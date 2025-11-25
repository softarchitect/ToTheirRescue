from datetime import datetime

from ..extensions import db


class SAHealthProcedure(db.Model):
    __tablename__ = "SAHealthProcedures"

    id = db.Column("Id", db.Integer, primary_key=True)
    kind = db.Column("Kind", db.String(300), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    sa_animal_type_id = db.Column("SAAnimalTypeId", db.Integer, nullable=False)



