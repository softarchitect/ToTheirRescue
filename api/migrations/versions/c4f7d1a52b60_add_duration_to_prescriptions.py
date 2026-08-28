"""add duration to prescriptions

Revision ID: c4f7d1a52b60
Revises: b8e2c4a91f03
Create Date: 2026-08-28 09:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c4f7d1a52b60"
down_revision = "b8e2c4a91f03"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "Prescriptions",
        sa.Column("Duration", sa.String(length=100), nullable=True),
    )


def downgrade():
    op.drop_column("Prescriptions", "Duration")
