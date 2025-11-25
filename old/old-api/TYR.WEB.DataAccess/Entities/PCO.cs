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
    [Table("PCOs")]
    public class PCO
    {
        [Key]
        public int Id { get; set; }

        [DefaultValue(false)]
        public bool SystemRecord { get; set; }

        [Column("FirstName", TypeName = "nvarchar(100)")]
        [Required]
        public string FirstName { get; set; }

        [Column("LastName", TypeName = "nvarchar(256)")]
        [Required]
        public string LastName { get; set; }

        [Column("Street", TypeName = "nvarchar(150)")]
        [Required]
        public string Street { get; set; }

        [Column("Street2", TypeName = "nvarchar(150)")]
        public string Street2 { get; set; }

        [Column("City", TypeName = "nvarchar(150)")]
        [Required]
        public string City { get; set; }

        [Column("State", TypeName = "nvarchar(50)")]
        public string State { get; set; }

        [Column("Zip", TypeName = "nvarchar(15)")]
        public string Zip { get; set; }

        [Column("Phone", TypeName = "nvarchar(20)")]
        public string Phone { get; set; }

        [Column("OtherPhone", TypeName = "nvarchar(20)")]
        public string OtherPhone { get; set; }

        [Column("Email", TypeName = "nvarchar(50)")]
        public string Email { get; set; }

        [DefaultValue(false)]
        public bool MailList { get; set; }

        [Column("Website", TypeName = "nvarchar(100)")]
        public string Website { get; set; }

        [Column("Contact", TypeName = "nvarchar(50)")]
        public string Contact { get; set; }

        [Column("RescueContact", TypeName = "nvarchar(50)")]
        public string RescueContact { get; set; }

        [Column("Notes", TypeName = "nvarchar(4000)")]
        public string Notes { get; set; }

        [Column("EntityType", TypeName = "nvarchar(10)")]
        public string EntityType { get; set; }

        [DefaultValue(false)]
        public bool Hospital { get; set; }

        [DefaultValue(false)]
        public bool Rescue { get; set; }

        [DefaultValue(false)]
        public bool Flag { get; set; }

        [Column("FlagReason", TypeName = "nvarchar(50)")]
        public string FlagReason { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime DateEntered { get; set; }

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime DateModified { get; set; }

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; }

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; }

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? CountryId { get; set; }
        [ForeignKey(nameof(CountryId))]
        public Country Country { get; set; }

        public int? TenantId { get; set; }
        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }
    }
}
