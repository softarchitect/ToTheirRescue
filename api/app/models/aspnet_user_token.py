from ..extensions import db


class AspNetUserToken(db.Model):
    __tablename__ = "AspNetUserTokens"

    user_id = db.Column("UserId", db.String(900), primary_key=True)
    login_provider = db.Column("LoginProvider", db.String(900), primary_key=True)
    name = db.Column("Name", db.String(900), primary_key=True)
    value = db.Column("Value", db.Text)



