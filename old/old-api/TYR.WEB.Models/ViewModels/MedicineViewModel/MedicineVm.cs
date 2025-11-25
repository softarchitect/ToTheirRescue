using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.MedicineViewModel
{
    public class MedicineVm
    {
        [Required(ErrorMessage = "Medicine Name is required")]
        public string MedicineName { get; set; }

        [Required(ErrorMessage = "Used For is required")]
        public string UsedFor { get; set; }

        public string Formulation { get; set; }
        public string Notes { get; set; }
    }
}
