using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.Models.ViewModels.TenantViewModel
{
    public class TenantVm
    {
        [Required(ErrorMessage = "Rescue Name is required")]
        public string Name { get; set; }
        public string TenantAcronym { get; set; }

        [Required(ErrorMessage = "Street is required")]
        public string Street { get; set; }

        [Required(ErrorMessage = "City or Township is required")]
        public string City { get; set; }

        [Required(ErrorMessage = "State or Locality Code is required")]
        public string State { get; set; }

        //[Required(ErrorMessage = "Zip/Postal Code is required")]
        public string Zip { get; set; }

        [Required(ErrorMessage = "Country is required")]
        public int CountryId { get; set; }
        //public string CountryCode { get; set; }
        //[Required(ErrorMessage = "Phone is required")]
        public string Phone { get; set; }
        //[Required(ErrorMessage = "Website is required")]
        public string Website { get; set; }
        public int NumberUsersPurchased { get; set; }
        public string Notes { get; set; }
        public bool MailList { get; set; }
        public string EnteredBy { get; set; }
        //[Required(ErrorMessage = "Email Address is required")]
        public string EmailAddress { get; set; }
    }
}
