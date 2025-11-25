using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.DataAccess.Entities
{
    [Table("PVDs")]
    public class ArtifactAttachment
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Entity { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string AttachmentType { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string OriginalFileName { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string FileName { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string FileNameExtension { get; set; }

        [Column("AttachmentDate", TypeName = "datetime2")]
        public DateTime? AttachmentDate { get; set; } = DateTime.Now;

        [Column(TypeName = "nvarchar(1000)")]
        public string Description { get; set; }

        public int PublicityRank { get; set; }

        public int SequenceNo { get; set; }

        [Column(TypeName = "nvarchar(1000)")]
        public string Notes { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string OriginalBlobUrl { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string BlobUrl { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string ThumbnailBlobUrl { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; } = DateTime.Now;

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime? DateModified { get; set; } = DateTime.Now;

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; }

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; }

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? PcoId { get; set; }
        [Column("Person", TypeName = "nvarchar(360)")]
        public string Person { get; set; }
        public int? AnimalId { get; set; }
        [Column("Animal", TypeName = "nvarchar(50)")]
        public string Animal { get; set; }
        public int? TenantId { get; set; }



      /*  [ForeignKey(nameof(PcoId))]
        public PCO PCO { get; set; }

        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; }

        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }*/
    }
}
