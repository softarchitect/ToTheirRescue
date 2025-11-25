using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.DataAccess.Entities
{
    [Table("Meds")]
    public class Med
    {
        [Key]
        public int Id { get; set; }
        public int? AnimalId { get; set; }
        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; }

        [DefaultValue(0)]
        public int? PrescriptionRecordNo { get; set; }

        [DefaultValue(false)]
        public bool Reminder { get; set; }

        public int? MedicineId { get; set; }
        [ForeignKey(nameof(MedicineId))]
        public Medicine Medicine { get; set; }

        [Column("AdministeredDate", TypeName = "datetime2")]
        public DateTime? AdministeredDate { get; set; }

        [Column("DueDate", TypeName = "datetime2")]
        public DateTime? DueDate { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Dosage { get; set; }

        [Column(TypeName = "nvarchar(2000)")]
        public string Notes { get; set; }

        //[DefaultValue(false)]
        //public bool Administered { get; set; }

        [Column(TypeName = "nvarchar(75)")]
        public string AdministeredBy { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(75)")]
        public string Clinic { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")] 
        public string Veterinarian { get; set; } = string.Empty;

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
        public int? TenantId { get; set; }
        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }
    }
}
