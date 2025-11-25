from ..extensions import db


class AspNetUserRole(db.Model):
    __tablename__ = "AspNetUserRoles"

    user_id = db.Column("UserId", db.String(900), primary_key=True)
    role_id = db.Column("RoleId", db.String(900), primary_key=True)



