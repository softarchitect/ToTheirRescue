using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.DataAccess.Entities
{
    [Table("SOAPs")]
    public class SOAP
    {
        [Key]
        public int Id { get; set; }

        [Column("ActionDate", TypeName = "datetime2")]
        public DateTime? ActionDate { get; set; }

        [Column("Subjective", TypeName = "nvarchar(4000)")]
        public string Subjective { get; set; }
       
        [Column("Objective", TypeName = "nvarchar(4000)")]
        public string Objective { get; set; }
       
        [Column("Assessment", TypeName = "nvarchar(4000)")]
        public string Assessment { get; set; }
       
        [Column("SOAPPlan", TypeName = "nvarchar(4000)")]
        public string SOAPPlan { get; set; }

        //[Column("Clinic", TypeName = "nvarchar(75)")]
        //public string Clinic { get; set; }
        public int? HospitalClinicId { get; set; }

        [ForeignKey(nameof(HospitalClinicId))]
        public PCO HospitalClinic { get; set; }

        [Column("Veterinarian", TypeName = "nvarchar(75)")]
        public string Veterinarian { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime DateEntered { get; set; }

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime DateModified { get; set; }

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; } = string.Empty;

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; } = string.Empty;

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? AnimalId { get; set; }
        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; }

        public int? TenantId { get; set; }
        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }

    }
}
