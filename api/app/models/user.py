from datetime import datetime

from ..extensions import db


class User(db.Model):
    """Lightweight mapping over AspNetUsers for issuing JWTs from Flask.

    Note: ASP.NET Identity password hashes are NOT compatible with Werkzeug/Flask
    directly. For now we store and verify passwords using a separate hash column
    (FlaskPasswordHash) so we don't break existing data. A migration step would be
    needed to move users over fully.
    """

    __tablename__ = "AspNetUsers"

    id = db.Column("Id", db.String(900), primary_key=True)
    user_name = db.Column("UserName", db.String(512), unique=True, nullable=False)
    normalized_user_name = db.Column("NormalizedUserName", db.String(512))
    email = db.Column("Email", db.String(512))
    normalized_email = db.Column("NormalizedEmail", db.String(512))
    email_confirmed = db.Column("EmailConfirmed", db.Boolean, default=False)
    password_hash = db.Column("PasswordHash", db.Text)
    security_stamp = db.Column("SecurityStamp", db.Text)
    concurrency_stamp = db.Column("ConcurrencyStamp", db.Text)
    phone_number = db.Column("PhoneNumber", db.Text)
    phone_number_confirmed = db.Column("PhoneNumberConfirmed", db.Boolean, default=False)
    two_factor_enabled = db.Column("TwoFactorEnabled", db.Boolean, default=False)
    lockout_end = db.Column("LockoutEnd", db.DateTime)
    lockout_enabled = db.Column("LockoutEnabled", db.Boolean, default=False)
    access_failed_count = db.Column("AccessFailedCount", db.Integer, default=0)

    first_name = db.Column("FirstName", db.String(250))
    last_name = db.Column("LastName", db.String(250))
    notes = db.Column("Notes", db.String(4000))
    status = db.Column("Status", db.String(50))
    tenant_id = db.Column("TenantId", db.Integer)
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False)

    # Optional extra column if you decide to manage Flask-side passwords separately
    flask_password_hash = db.Column("FlaskPasswordHash", db.String(255))

    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)


