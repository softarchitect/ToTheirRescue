"""add password reset tokens table

Revision ID: d5a3e9c71b48
Revises: c4f7d1a52b60
Create Date: 2026-08-30 03:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d5a3e9c71b48"
down_revision = "c4f7d1a52b60"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "PasswordResetTokens",
        sa.Column("Id", sa.Integer(), nullable=False),
        sa.Column("UserId", sa.String(length=900), nullable=False),
        sa.Column("TokenHash", sa.String(length=64), nullable=False),
        sa.Column("ExpiryDate", sa.DateTime(), nullable=False),
        sa.Column("UsedDate", sa.DateTime(), nullable=True),
        sa.Column("DateEntered", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("Id"),
    )
    op.create_index("ix_PasswordResetTokens_UserId", "PasswordResetTokens", ["UserId"])
    op.create_index(
        "ix_PasswordResetTokens_TokenHash",
        "PasswordResetTokens",
        ["TokenHash"],
        unique=True,
    )


def downgrade():
    op.drop_index("ix_PasswordResetTokens_TokenHash", table_name="PasswordResetTokens")
    op.drop_index("ix_PasswordResetTokens_UserId", table_name="PasswordResetTokens")
    op.drop_table("PasswordResetTokens")
