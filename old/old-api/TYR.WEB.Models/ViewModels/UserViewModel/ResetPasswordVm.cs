using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.UserViewModel
{
    public class ResetPasswordVm
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Password { get; set; }

    }
}
