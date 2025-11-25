using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.UserViewModel
{
    public class UserTenantVM
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string TenantAcronym { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public string Phone { get; set; }
        public string Website { get; set; }
        public int NumberUsersPurchased { get; set; }
        public string Notes { get; set; }
        public bool MailList { get; set; }
    }
}
