using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.DataAccess.IdentityAuth
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AlternateEmailAddress { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Column("DateEntered", TypeName = "datetime2")]
        public DateTime? DateEntered { get; set; }
        public string EnteredBy { get; set; }
        public string Status { get; set; }
        public DateTime? DateActive { get; set; } = null;
        public DateTime? DateInactive { get; set; } = null;
        public string Notes { get; set; }
        public DateTime? DateInvited { get; set; } = null;
        public string Inviter { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        // Foreign Key for Tenant
        public int TenantId { get; set; }

        [ForeignKey(nameof(TenantId))]
        public Tenant Tenant { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; }

    }
}
