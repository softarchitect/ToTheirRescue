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
    [Table("Medicines")]
    public class Medicine
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string MedicineName { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string UsedFor { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Formulation { get; set; }

        [DefaultValue(false)]
        public bool MonthlyMed { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Notes { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; } = DateTime.Now;

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime? DateModified { get; set; } = DateTime.Now;

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; } = string.Empty;

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; } = string.Empty;

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? TenantId { get; set; }
        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }
    }
}
