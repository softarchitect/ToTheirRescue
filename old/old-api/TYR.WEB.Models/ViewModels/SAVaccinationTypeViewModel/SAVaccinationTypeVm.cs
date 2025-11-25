using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.SAVaccinationTypeViewModel
{
    public class SAVaccinationTypeVm
    {
        [Required(ErrorMessage = "Kind Name is required")]
        public string Kind { get; set; }
        public int SAAnimalTypeId { get; set; }
    }
}
