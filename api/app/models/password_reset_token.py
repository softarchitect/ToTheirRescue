from datetime import datetime

from ..extensions import db


class PasswordResetToken(db.Model):
    """A single-use, time-limited password reset token.

    Only the SHA-256 hash of the token is stored, so a leak of this table
    does not let an attacker reset anyone's password.
    """

    __tablename__ = "PasswordResetTokens"

    id = db.Column("Id", db.Integer, primary_key=True)
    user_id = db.Column("UserId", db.String(900), nullable=False, index=True)
    token_hash = db.Column("TokenHash", db.String(64), nullable=False, unique=True, index=True)
    expiry_date = db.Column("ExpiryDate", db.DateTime, nullable=False)
    used_date = db.Column("UsedDate", db.DateTime)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
