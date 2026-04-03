"""add singular/plural names to SA animal types

Revision ID: 3c21b7e9ad14
Revises: 7b0d6a1c2f19
Create Date: 2026-04-03 15:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "3c21b7e9ad14"
down_revision = "7b0d6a1c2f19"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("SAAnimalTypes") as batch_op:
        batch_op.add_column(sa.Column("SingularName", sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column("PluralName", sa.String(length=50), nullable=True))

    op.execute(
        """
        UPDATE "SAAnimalTypes"
        SET "PluralName" = COALESCE("TypeName", '')
        WHERE "PluralName" IS NULL OR TRIM("PluralName") = ''
        """
    )
    op.execute(
        """
        UPDATE "SAAnimalTypes"
        SET "SingularName" = COALESCE("TypeName", '')
        WHERE "SingularName" IS NULL OR TRIM("SingularName") = ''
        """
    )

    with op.batch_alter_table("SAAnimalTypes") as batch_op:
        batch_op.alter_column("SingularName", existing_type=sa.String(length=50), nullable=False)
        batch_op.alter_column("PluralName", existing_type=sa.String(length=50), nullable=False)


def downgrade():
    with op.batch_alter_table("SAAnimalTypes") as batch_op:
        batch_op.drop_column("PluralName")
        batch_op.drop_column("SingularName")
