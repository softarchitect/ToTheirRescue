from datetime import datetime

from ..extensions import db


class Region(db.Model):
    __tablename__ = "Regions"

    id = db.Column("Id", db.Integer, primary_key=True)
    country_id = db.Column("CountryId", db.Integer, nullable=False)
    region_name = db.Column("RegionName", db.String(200), nullable=False)
    region_code = db.Column("RegionCode", db.String(20))
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "countryId": self.country_id,
            "regionName": self.region_name,
            "regionCode": self.region_code,
            "dateEntered": self.date_entered.isoformat() if self.date_entered else None,
            "dateModified": self.date_modified.isoformat() if self.date_modified else None,
            "enteredBy": self.entered_by,
            "modifiedBy": self.modified_by,
        }
