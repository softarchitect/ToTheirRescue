from datetime import datetime

from ..extensions import db


class PCO(db.Model):
    """Mapping of the PCOs table (people/companies/organizations)."""

    __tablename__ = "PCOs"

    id = db.Column("Id", db.Integer, primary_key=True)

    system_record = db.Column("SystemRecord", db.Boolean, default=False)

    first_name = db.Column("FirstName", db.String(100), nullable=False)
    last_name = db.Column("LastName", db.String(256), nullable=False)

    street = db.Column("Street", db.String(150), nullable=False)
    street2 = db.Column("Street2", db.String(150))
    city = db.Column("City", db.String(150), nullable=False)
    state = db.Column("State", db.String(50))
    zip = db.Column("Zip", db.String(15))

    phone = db.Column("Phone", db.String(20))
    other_phone = db.Column("OtherPhone", db.String(20))
    email = db.Column("Email", db.String(50))

    mail_list = db.Column("MailList", db.Boolean, default=False)
    website = db.Column("Website", db.String(100))
    contact = db.Column("Contact", db.String(50))
    rescue_contact = db.Column("RescueContact", db.String(50))
    notes = db.Column("Notes", db.String(4000))

    entity_type = db.Column("EntityType", db.String(10))
    hospital = db.Column("Hospital", db.Boolean, default=False)
    rescue = db.Column("Rescue", db.Boolean, default=False)
    flag = db.Column("Flag", db.Boolean, default=False)
    flag_reason = db.Column("FlagReason", db.String(50))

    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(256))
    modified_by = db.Column("ModifiedBy", db.String(256))

    is_deleted = db.Column("IsDeleted", db.Boolean, default=False)

    country_id = db.Column("CountryId", db.Integer)
    tenant_id = db.Column("TenantId", db.Integer)

    def to_dict_basic(self) -> dict:
        return {
            "id": str(self.id),
            "lastName": self.last_name,
            "firstName": self.first_name,
            "street": self.street or "",
            "city": self.city or "",
            "state": self.state or "",
            "zip": self.zip or "",
            "phone": self.phone or "",
            "email": self.email or "",
            "isVolunteer": False,  # derived from Volunteer table in a richer implementation
        }


