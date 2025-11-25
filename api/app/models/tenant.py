from datetime import datetime

from ..extensions import db


class Tenant(db.Model):
    __tablename__ = "Tenants"

    id = db.Column("ID", db.Integer, primary_key=True)
    name = db.Column("Name", db.String(512), nullable=False)
    tenant_acronym = db.Column("TenantAcronym", db.String(50), nullable=False)
    street = db.Column("Street", db.String(1024), nullable=False)
    city = db.Column("City", db.String(300), nullable=False)
    state = db.Column("State", db.String(100), nullable=False)
    zip = db.Column("Zip", db.String(30), nullable=False)
    phone = db.Column("Phone", db.String(40), nullable=False)
    website = db.Column("Website", db.String(300), nullable=False)
    status = db.Column("Status", db.String(60), nullable=False)
    number_users_purchased = db.Column("NumberUsersPurchased", db.Integer, nullable=False)
    notes = db.Column("Notes", db.String(8000))
    mail_list = db.Column("MailList", db.Boolean, default=False, nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    email_address = db.Column("EmailAddress", db.String(512), nullable=False)
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    country_id = db.Column("CountryId", db.Integer, nullable=False)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    modified_by = db.Column("ModifiedBy", db.String(512))



