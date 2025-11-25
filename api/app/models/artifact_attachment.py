from datetime import datetime

from ..extensions import db


class ArtifactAttachment(db.Model):
    """Maps to the PVDs table (photos, videos, documents)."""

    __tablename__ = "PVDs"

    id = db.Column("Id", db.Integer, primary_key=True)
    entity = db.Column("Entity", db.String(100), nullable=False)
    attachment_type = db.Column("AttachmentType", db.String(100), nullable=False)
    file_name = db.Column("FileName", db.String(200), nullable=False)
    file_name_extension = db.Column("FileNameExtension", db.String(100), nullable=False)
    attachment_date = db.Column("AttachmentDate", db.DateTime, nullable=False)
    publicity_rank = db.Column("PublicityRank", db.Integer)
    sequence_no = db.Column("SequenceNo", db.Integer)
    notes = db.Column("Notes", db.String(2000))
    original_blob_url = db.Column("OriginalBlobUrl", db.String(512))
    blob_url = db.Column("BlobUrl", db.String(512))
    thumbnail_blob_url = db.Column("ThumbnailBlobUrl", db.String(512))
    date_entered = db.Column("DateEntered", db.DateTime, default=datetime.utcnow)
    date_modified = db.Column("DateModified", db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    entered_by = db.Column("EnteredBy", db.String(512))
    modified_by = db.Column("ModifiedBy", db.String(512))
    is_deleted = db.Column("IsDeleted", db.Boolean, default=False, nullable=False)
    pco_id = db.Column("PcoId", db.Integer)
    animal_id = db.Column("AnimalId", db.Integer)
    tenant_id = db.Column("TenantId", db.Integer)
    animal = db.Column("Animal", db.String(100))
    description = db.Column("Description", db.String(2000))
    person = db.Column("Person", db.String(720))
    original_file_name = db.Column("OriginalFileName", db.String(200))



