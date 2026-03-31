"""add country currency abbreviation and date format

Revision ID: 9b3f4ad3f4f1
Revises: 12d06e677cc9
Create Date: 2026-03-31 10:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9b3f4ad3f4f1"
down_revision = "12d06e677cc9"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("Countries", sa.Column("CurrencyAbbreviation", sa.String(length=10), nullable=True))
    op.add_column("Countries", sa.Column("DateFormat", sa.String(length=20), nullable=True))


def downgrade():
    op.drop_column("Countries", "DateFormat")
    op.drop_column("Countries", "CurrencyAbbreviation")
