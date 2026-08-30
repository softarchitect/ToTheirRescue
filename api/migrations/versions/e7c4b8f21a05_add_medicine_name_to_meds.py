"""add medicine name to meds

Revision ID: e7c4b8f21a05
Revises: d5a3e9c71b48
Create Date: 2026-08-30 04:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e7c4b8f21a05"
down_revision = "d5a3e9c71b48"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("Meds", sa.Column("MedicineName", sa.String(length=150), nullable=True))


def downgrade():
    op.drop_column("Meds", "MedicineName")
