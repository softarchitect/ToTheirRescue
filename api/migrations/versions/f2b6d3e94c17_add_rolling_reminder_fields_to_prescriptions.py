"""add rolling reminder fields to prescriptions

Revision ID: f2b6d3e94c17
Revises: e7c4b8f21a05
Create Date: 2026-08-31 10:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f2b6d3e94c17"
down_revision = "e7c4b8f21a05"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("Prescriptions", sa.Column("MedicineName", sa.String(length=150), nullable=True))
    op.add_column("Prescriptions", sa.Column("Dosage", sa.String(length=100), nullable=True))
    op.add_column(
        "Prescriptions",
        sa.Column("TimesADay", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column("Prescriptions", sa.Column("RemindersThrough", sa.DateTime(), nullable=True))
    op.add_column(
        "Prescriptions",
        sa.Column(
            "RemindersStopped", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
    )


def downgrade():
    op.drop_column("Prescriptions", "RemindersStopped")
    op.drop_column("Prescriptions", "RemindersThrough")
    op.drop_column("Prescriptions", "TimesADay")
    op.drop_column("Prescriptions", "Dosage")
    op.drop_column("Prescriptions", "MedicineName")
