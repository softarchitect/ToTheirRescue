from ..extensions import db


class AspNetRole(db.Model):
    __tablename__ = "AspNetRoles"

    id = db.Column("Id", db.String(900), primary_key=True)
    name = db.Column("Name", db.String(512))
    normalized_name = db.Column("NormalizedName", db.String(512))
    concurrency_stamp = db.Column("ConcurrencyStamp", db.Text)



