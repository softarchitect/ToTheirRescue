from datetime import datetime

from ..extensions import db


class Country(db.Model):
    __tablename__ = "Countries"

    id = db.Column("Id", db.Integer, primary_key=True)
    country_name = db.Column("CountryName", db.String(200), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    iso2_code = db.Column("ISO2Code", db.String(6))
    isd_code = db.Column("ISDCode", db.Integer)

    def to_dict_basic(self) -> dict:
        """Minimal shape for country dropdowns and lookups.

        This is tuned for the new frontend but roughly equivalent to the old
        Country entity (Id, CountryName, ISO2Code, ISDCode).
        """
        return {
            "id": str(self.id),
            "name": self.country_name,
            "iso2Code": self.iso2_code,
            "isdCode": self.isd_code,
        }

