from datetime import datetime

from ..extensions import db


class Animal(db.Model):
    """Minimal mapping of the existing Animals table for the new API.

    This is based on TYR.WEB.DataAccess.Entities.Animal and the SQL schema.
    """

    __tablename__ = "Animals"

    id = db.Column("Id", db.Integer, primary_key=True)

    animal_name = db.Column("AnimalName", db.String(50), nullable=False)
    current_resident = db.Column("CurrentResident", db.Boolean, default=True)
    breed = db.Column("Breed", db.String(50), default="")
    color = db.Column("Color", db.String(200), default="")
    sex = db.Column("Sex", db.String(10), default="")
    spayed_or_neutered = db.Column("SpayedOrNeutered", db.Boolean, default=False)

    last_milestone = db.Column("LastMilestone", db.String(25), default="")
    last_milestone_date = db.Column("LastMilestoneDate", db.DateTime)

    notes = db.Column("Notes", db.String(4000), default="")

    flag = db.Column("Flag", db.Boolean, default=False)
    flag_reason = db.Column("FlagReason", db.String(50), default="")
    location = db.Column("Location", db.String(50), default="")

    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(256), default="")
    modified_by = db.Column("ModifiedBy", db.String(256), default="")
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False)

    pco_id = db.Column("PcoId", db.Integer)
    tenant_id = db.Column("TenantId", db.Integer)

    animal_type_id = db.Column("AnimalTypeId", db.Integer)
    animal_type_name = db.Column("AnimalTypeName", db.String(25), default="")

    animal_id = db.Column("AnimalId", db.Integer)  # legacy sequential id

    chronic_condition = db.Column("ChronicCondition", db.String(50), default="")
    status = db.Column("Status", db.String(25), default="")
    publicity_blurb = db.Column("PublicityBlurb", db.String(2000), default="")
    diet = db.Column("Diet", db.String(1000), default="")

    def to_dict_basic(self) -> dict:
        """Shape close to the new frontend's Animal type."""
        return {
            "id": str(self.id),
            "name": self.animal_name,
            "type": self._frontend_type(),
            "breed": self.breed or "",
            "age": 0,  # age is not stored directly in Animals; compute separately if needed
            "gender": (self.sex or "").lower() or "unknown",
            "status": (self.status or "available").lower(),
            "arrivalDate": (self.date_entered or datetime.utcnow()).date().isoformat(),
            "description": self.publicity_blurb or (self.notes or ""),
            "medicalNotes": self.chronic_condition or None,
            "imageUrl": "/placeholder.svg",
            "isWildlife": self._is_wildlife(),
            "color": self.color or None,
            "chronicCondition": self.chronic_condition or None,
            "lastMilestone": self.last_milestone or None,
            "lastMilestoneDate": self.last_milestone_date.isoformat() if self.last_milestone_date else None,
        }

    def _frontend_type(self) -> str:
        name = (self.animal_type_name or "").lower()
        if name in {"dog", "cat", "bird", "rabbit"}:
            return name
        if "wild" in name:
            return "wildlife"
        return "other"

    def _is_wildlife(self) -> bool:
        name = (self.animal_type_name or "").lower()
        return "wild" in name


