from datetime import datetime

from ..extensions import db


class OTP(db.Model):
    __tablename__ = "OTPs"

    id = db.Column("Id", db.Integer, primary_key=True)
    otp_code = db.Column("OtpCode", db.Text, nullable=False)
    email = db.Column("Email", db.String(512), nullable=False)
    is_email_otp_verified = db.Column("IsEmailOtpVerified", db.Boolean, default=False, nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))



