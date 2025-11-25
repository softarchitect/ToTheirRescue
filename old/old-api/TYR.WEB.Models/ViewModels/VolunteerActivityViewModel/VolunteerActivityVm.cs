using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.VolunteerActivityViewModel
{
    public class VolunteerActivityVm
    {
        [Required(ErrorMessage = "Volunteer Activity Name is required")]
        public string VolunteerActivityName { get; set; }
    }
}
