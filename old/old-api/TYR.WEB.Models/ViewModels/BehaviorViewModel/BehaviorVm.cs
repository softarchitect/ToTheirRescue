using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.BehaviorViewModel
{
    public class BehaviorVm
    {
        [Required(ErrorMessage = "Behavior is required")]
        public string BehaviorName { get; set; }
        public int AnimalTypeId { get; set; }
    }
}
