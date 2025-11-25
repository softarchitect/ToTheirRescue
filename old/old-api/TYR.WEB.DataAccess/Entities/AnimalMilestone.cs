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
    [Table("AnimalMilestones")]
    public class AnimalMilestone
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(25)")]
        public string MilestoneType { get; set; }

        [Column("MilestoneDate", TypeName = "datetime2")]
        public DateTime? MilestoneDate { get; set; }

        [DefaultValue(false)]
        public bool IsApproxDOB { get; set; }
        //[Column(TypeName = "nvarchar(255)")]
        //public string OtherRescue { get; set; }

        [Column(TypeName = "nvarchar(25)")]
        public string OtherRescueIDNo { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal AmountPaidFee { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal AmountReceivedFee { get; set; }

        [Column(TypeName = "nvarchar(4000)")]
        public string Notes { get; set; }

        [Column(TypeName = "nvarchar(75)")]
        public string AcquisitionWayName { get; set; }

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

        public int? OtherRescueShelterId { get; set; }

        //[ForeignKey(nameof(OtherRescueShelterId))]
        //public OtherRescueShelter OtherRescueShelter { get; set; }

        public int? AcquisitionWayId { get; set; }

        //[ForeignKey(nameof(AcquisitionWayId))]
        //public AcquisitionWay AcquisitionWay { get; set; }

        public int? PcoId { get; set; }

        [ForeignKey(nameof(PcoId))]
        public PCO PCO { get; set; }

        public int? AnimalId { get; set; }

        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; }

        public int? TenantId { get; set; }

        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }
    }
}
