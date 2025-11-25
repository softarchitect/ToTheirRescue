using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;

namespace TYR.WEB.DataAccess.Entities
{
    public class Tenant
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string TenantAcronym { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        
        public string Phone { get; set; }
        public string Website { get; set; }
        public string Status { get; set; }
        public int NumberUsersPurchased { get; set; }
        public string Notes { get; set; }
        public bool MailList { get; set; }
        public DateTime DateEntered { get; set; }
        [Column("DateModified", TypeName = "datetime2")]
        public DateTime DateModified { get; set; }
        public string EnteredBy { get; set; }
        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; }
        public string EmailAddress { get; set; }

        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? CountryId { get; set; }
        [ForeignKey(nameof(CountryId))]
        public Country Country { get; set; }

        public ICollection<ApplicationUser> ApplicationUsers { get; set; }
        public ICollection<AnimalType> AnimalTypes { get; set; }
        public ICollection<AcquisitionWay> AcquisitionWays { get; set; }

    }
}
