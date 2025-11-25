using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.VaccinationTypeViewModel
{
    public class VaccinationTypeVm
    {
        [Required(ErrorMessage = "Kind is required")]
        public string Kind { get; set; }
        public int AnimalTypeId { get; set; }
    }
}
