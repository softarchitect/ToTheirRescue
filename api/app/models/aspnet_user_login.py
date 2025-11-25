from ..extensions import db


class AspNetUserLogin(db.Model):
    __tablename__ = "AspNetUserLogins"

    login_provider = db.Column("LoginProvider", db.String(900), primary_key=True)
    provider_key = db.Column("ProviderKey", db.String(900), primary_key=True)
    provider_display_name = db.Column("ProviderDisplayName", db.Text)
    user_id = db.Column("UserId", db.String(900), nullable=False)



