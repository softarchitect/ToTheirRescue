"""add source vaccination link to reminders

Revision ID: a4d91cb6f2a1
Revises: 3c21b7e9ad14
Create Date: 2026-04-03 18:35:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a4d91cb6f2a1"
down_revision = "3c21b7e9ad14"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "AnimalVaccinations",
        sa.Column("SourceVaccinationId", sa.Integer(), nullable=True),
    )


def downgrade():
    op.drop_column("AnimalVaccinations", "SourceVaccinationId")
