using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.SAVolunteerActivityViewModel
{
    public class SAVolunteerActivityVm
    {
        [Required(ErrorMessage = "Volunteer Activity Name is required")]
        public string SAVolunteerActivityName { get; set; }
    }
}
