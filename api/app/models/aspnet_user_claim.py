from ..extensions import db


class AspNetUserClaim(db.Model):
    __tablename__ = "AspNetUserClaims"

    id = db.Column("Id", db.Integer, primary_key=True)
    user_id = db.Column("UserId", db.String(900), nullable=False)
    claim_type = db.Column("ClaimType", db.Text)
    claim_value = db.Column("ClaimValue", db.Text)



