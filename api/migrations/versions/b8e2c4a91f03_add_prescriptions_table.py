"""add prescriptions table

Revision ID: b8e2c4a91f03
Revises: a4d91cb6f2a1
Create Date: 2026-08-27 10:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b8e2c4a91f03"
down_revision = "a4d91cb6f2a1"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "Prescriptions",
        sa.Column("Id", sa.Integer(), nullable=False),
        sa.Column("AnimalId", sa.Integer(), nullable=False),
        sa.Column("PrescriptionText", sa.String(length=2000), nullable=False),
        sa.Column("Clinic", sa.String(length=150), nullable=True),
        sa.Column("Veterinarian", sa.String(length=100), nullable=True),
        sa.Column("SpecialInstructions", sa.String(length=4000), nullable=True),
        sa.Column("StartDate", sa.DateTime(), nullable=True),
        sa.Column("DateEntered", sa.DateTime(), nullable=True),
        sa.Column("DateModified", sa.DateTime(), nullable=True),
        sa.Column("EnteredBy", sa.String(length=512), nullable=True),
        sa.Column("ModifiedBy", sa.String(length=512), nullable=True),
        sa.Column("IsDeleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("TenantId", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("Id"),
    )
    op.create_index("ix_Prescriptions_AnimalId", "Prescriptions", ["AnimalId"])
    op.create_index("ix_Prescriptions_TenantId", "Prescriptions", ["TenantId"])


def downgrade():
    op.drop_index("ix_Prescriptions_TenantId", table_name="Prescriptions")
    op.drop_index("ix_Prescriptions_AnimalId", table_name="Prescriptions")
    op.drop_table("Prescriptions")
