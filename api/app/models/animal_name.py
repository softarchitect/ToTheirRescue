from datetime import datetime

from ..extensions import db


class AnimalName(db.Model):
    __tablename__ = "AnimalNames"

    id = db.Column("Id", db.Integer, primary_key=True)
    sex = db.Column("Sex", db.String(20), nullable=False)
    name = db.Column("Name", db.String(150), nullable=False)
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)



