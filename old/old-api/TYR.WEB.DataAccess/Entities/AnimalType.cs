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
    [Table("AnimalTypes")]
    public class AnimalType
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(25)")]
        public string TypeName { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; } = DateTime.Now;

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime? DateModified { get; set; } = DateTime.Now;

        [Column(TypeName = "nvarchar(256)")]
        public string RoleName { get; set; }

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; }

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; }

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int TenantId { get; set; }
        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }

        //public int SAAnimalTypeId { get; set; }
        //[ForeignKey(nameof(SAAnimalTypeId))]
        //public SAAnimalType SAAnimalType { get; set; }
    }
}
