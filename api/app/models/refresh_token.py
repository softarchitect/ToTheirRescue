from datetime import datetime

from ..extensions import db


class RefreshToken(db.Model):
    __tablename__ = "RefreshTokens"

    id = db.Column("Id", db.Integer, primary_key=True)
    user_id = db.Column("UserId", db.String(900), nullable=False)
    token = db.Column("Token", db.Text, nullable=False)
    jwt_id = db.Column("JwtId", db.Text, nullable=False)
    is_used = db.Column("IsUsed", db.Boolean, default=False, nullable=False)
    is_revoked = db.Column("IsRevoked", db.Boolean, default=False, nullable=False)
    added_date = db.Column("AddedDate", db.DateTime, default=datetime.utcnow)
    expiry_date = db.Column("ExpiryDate", db.DateTime, nullable=False)



