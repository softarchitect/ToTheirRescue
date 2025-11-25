using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AcquisitionWayViewModel
{
    public class AcquisitionWayVm
    {
        [Required(ErrorMessage = "Acquisition Way Name is required")]
        public string AcquisitionWayName { get; set; }
    }
}
