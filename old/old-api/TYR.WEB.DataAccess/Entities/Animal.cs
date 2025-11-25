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
    [Table("Animals")]
    public class Animal
    {
        [Key]
        public int Id { get; set; }

        //public int AssignedAnimalId { get; set; }
        //public int AnimalId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string AnimalName { get; set; }

        [DefaultValue(true)]
        public bool? CurrentResident { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Breed { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Color { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public string Sex { get; set; }

        [DefaultValue(false)]
        public bool SpayedOrNeutered { get; set; }

        [Column(TypeName = "nvarchar(25)")]
        public string LastMilestone { get; set; }

        [Column("LastMilestoneDate", TypeName = "datetime2")]
        public DateTime? LastMilestoneDate { get; set; }

        [Column(TypeName = "nvarchar(4000)")]
        public string Notes { get; set; }

        //[Column(TypeName = "nvarchar(20)")]
        //public string OtherIDNo { get; set; }

        [DefaultValue(false)]
        public bool Flag { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string FlagReason { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Location { get; set; }

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

        [ForeignKey(nameof(PcoId))]
        public PCO PCO { get; set; }

        public string AnimalTypeName { get; set; }

        public int? AnimalTypeId { get; set; }

        [ForeignKey(nameof(AnimalTypeId))]
        public AnimalType AnimalType { get; set; }

        public int? TenantId { get; set; }

        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }
        public int AnimalId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string ChronicCondition { get; set; }

        [Column(TypeName = "nvarchar(25)")]
        public string Status { get; set; }

        [Column(TypeName = "nvarchar(2000)")]
        public string PublicityBlurb { get; set; }

        [Column(TypeName = "nvarchar(1000)")]
        public string Diet { get; set; }
    }
}
