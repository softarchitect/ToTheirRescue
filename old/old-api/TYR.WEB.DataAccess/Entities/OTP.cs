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
    [Table("OTPs")]
    public class OTP
    {
        [Key]
        public int Id { get; set; }
        
        public string OtpCode { get; set; }

        public string Email { get; set; }

        [DefaultValue(false)]
        public bool IsEmailOtpVerified { get; set; }

        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; } = DateTime.Now;

        [Column("DateModified", TypeName = "datetime2")]
        public DateTime? DateModified { get; set; } = DateTime.Now;

        [Column("EnteredBy", TypeName = "nvarchar(256)")]
        public string EnteredBy { get; set; }

        [Column("ModifiedBy", TypeName = "nvarchar(256)")]
        public string ModifiedBy { get; set; }

        //public int? TenantId { get; set; }
    }
}
