using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.UserViewModel
{
    public class InviteUserVm
    {
        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; } 

        [Required(ErrorMessage = "Email Address is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Role Name is required")]
        public string RoleName { get; set; }
        public string PhoneNumber { get; set; }

    }
}
