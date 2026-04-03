"""add system settings table

Revision ID: 7b0d6a1c2f19
Revises: 9b3f4ad3f4f1
Create Date: 2026-04-03 10:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7b0d6a1c2f19"
down_revision = "9b3f4ad3f4f1"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "SystemSettings",
        sa.Column("Id", sa.Integer(), nullable=False),
        sa.Column("Key", sa.String(length=120), nullable=False),
        sa.Column("BoolValue", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("DateEntered", sa.DateTime(), nullable=True),
        sa.Column("DateModified", sa.DateTime(), nullable=True),
        sa.Column("EnteredBy", sa.String(length=512), nullable=True),
        sa.Column("ModifiedBy", sa.String(length=512), nullable=True),
        sa.Column("IsDeleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.PrimaryKeyConstraint("Id"),
        sa.UniqueConstraint("Key"),
    )


def downgrade():
    op.drop_table("SystemSettings")
