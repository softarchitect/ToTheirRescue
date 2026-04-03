from datetime import datetime

from ..extensions import db


class SAAnimalType(db.Model):
    __tablename__ = "SAAnimalTypes"

    id = db.Column("Id", db.Integer, primary_key=True)
    type_name = db.Column("TypeName", db.String(50), nullable=False)
    singular_name = db.Column("SingularName", db.String(50), nullable=False, default="")
    plural_name = db.Column("PluralName", db.String(50), nullable=False, default="")
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            # Keep typeName for backward compatibility; it now mirrors plural form.
            "typeName": self.plural_name or self.type_name,
            "singularName": self.singular_name or "",
            "pluralName": self.plural_name or self.type_name or "",
            "dateEntered": self.date_entered.isoformat() if self.date_entered else None,
            "dateModified": self.date_modified.isoformat() if self.date_modified else None,
            "enteredBy": self.entered_by,
            "modifiedBy": self.modified_by,
        }



