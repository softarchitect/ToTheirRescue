from ..extensions import db


class AspNetRoleClaim(db.Model):
    __tablename__ = "AspNetRoleClaims"

    id = db.Column("Id", db.Integer, primary_key=True)
    role_id = db.Column("RoleId", db.String(900), nullable=False)
    claim_type = db.Column("ClaimType", db.Text)
    claim_value = db.Column("ClaimValue", db.Text)



