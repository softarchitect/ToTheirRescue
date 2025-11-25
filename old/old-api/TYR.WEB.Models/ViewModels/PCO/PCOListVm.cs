using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.Models.ViewModels.PCO
{
    public class PCOListVm
    {
        public int Id { get; set; }
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
        public string Notes { get; set; }
        public string EntityType { get; set; }
        //public string Contact { get; set; }
        //public string RescueContact { get; set; }
        public bool Hospital { get; set; }
        public bool Rescue { get; set; }
        public bool Flag { get; set; }
        public string FlagReason { get; set; }
        public string Website { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public string CountryISO2Code { get; set; }
        public int CountryISDCode { get; set; }
        public List<ArtifactAttachment> Attachments { get; set; }

    }
}
