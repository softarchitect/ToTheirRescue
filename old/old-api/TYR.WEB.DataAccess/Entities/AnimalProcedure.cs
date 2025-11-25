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
    [Table("AnimalProcedures")]
    public class AnimalProcedure
    {
        [Key]
        public int Id { get; set; }

        public int? AnimalId { get; set; }

        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; }

        public int? KindId { get; set; } // Kind - (FK, int, not null) – this is the FK from the HealthProcedures table

        [ForeignKey(nameof(KindId))]
        public HealthProcedure HealthProcedure { get; set; }

        [DefaultValue(false)]
        public bool Reminder { get; set; }

        [Column("DueDate", TypeName = "datetime2")]
        public DateTime? DueDate { get; set; }

        [Column("ActionDate", TypeName = "datetime2")]
        public DateTime? ActionDate { get; set; }

        public string Weight { get; set; }
        //public string Clinic { get; set; } = string.Empty;
        public int? HospitalClinicId { get; set; }

        [ForeignKey(nameof(HospitalClinicId))]
        public PCO HospitalClinic { get; set; }
        public string Administerer { get; set; }
        public string Results { get; set; }
        public string MicrochipNumber { get; set; }
        public string Notes { get; set; }

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; } = DateTime.Now;

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime? DateModified { get; set; } = DateTime.Now;

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; }

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; } = string.Empty;

        public int? TenantId { get; set; }

        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }
    }
}
