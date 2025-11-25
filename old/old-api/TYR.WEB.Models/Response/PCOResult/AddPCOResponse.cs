using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.PCO;
namespace TYR.WEB.Models.Response.PCOResult
{
    public class AddPCOResponse : BaseOperationResult
    {
        public AddPCOData Data { get; set; }
    }
    public class AddPCOData
    {
        public int Id { get; set; }
        public PCOCustom PCO { get; set; }
    }

    public class PCOCustom
    {
        public int Id { get; set; }
        public bool SystemRecord { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string Street2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string OtherPhone { get; set; }
        public string Email { get; set; }
        public bool MailList { get; set; }
        public string Website { get; set; }
        public string Contact { get; set; }
        public string RescueContact { get; set; }
        public string Notes { get; set; }
        public string EntityType { get; set; }
        public bool Hospital { get; set; }
        public bool Rescue { get; set; }
        public bool Flag { get; set; }
        public string FlagReason { get; set; }
        public DateTime DateEntered { get; set; }
        public DateTime DateModified { get; set; }
        public string EnteredBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? CountryId { get; set; }
        public int? TenantId { get; set; }
    }
}
