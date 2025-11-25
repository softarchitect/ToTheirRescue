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
    [Table("Diary")]
    public class Diary
    {
        [Key]
        public int Id { get; set; }
        public int? AnimalId { get; set; }
        //[ForeignKey(nameof(AnimalId))]
        //public Animal Animal { get; set; }
        [Column("Animal", TypeName = "nvarchar(50)")]
        public string Animal { get; set; } = string.Empty;

        public string TenantOrAnimal { get; set; } // TenantOrAnimal – this identifies if the entry is for an animal or the tenant  - nvarchar(6), not null – allowable values are ‘tenant’ and ‘animal’

        [Column("ActionDate", TypeName = "datetime2")]
        public DateTime? ActionDate { get; set; }
        public string Notes { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; } = DateTime.Now;

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime? DateModified { get; set;} = DateTime.Now;

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; }

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; }

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? TenantId { get; set; }

        //[ForeignKey(nameof(TenantId))]
        //public Tenant Tenant { get; set; }
    }
}
