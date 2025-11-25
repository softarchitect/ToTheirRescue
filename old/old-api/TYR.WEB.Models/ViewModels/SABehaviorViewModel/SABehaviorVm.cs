using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.SABehaviorViewModel
{
    public class SABehaviorVm
    {
        [Required(ErrorMessage = "Behavior Name is required")]
        public string BehaviorName { get; set; }
        public int SAAnimalTypeId { get; set; }
    }
}
