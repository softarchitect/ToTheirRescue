using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.WEB.Models.ViewModels.SignUp
{
    public class SignUpVm
    {
        [Required(ErrorMessage = "User Name is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }

        public string AlternateEmailAddress { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
        public string PhoneNumber { get; set; }

        public CreateTenantVm TenantVm { get; set; }

    }


}
