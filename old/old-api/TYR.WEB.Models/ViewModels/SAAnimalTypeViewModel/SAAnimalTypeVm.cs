using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.SAAnimalTypeViewModel
{
    public class SAAnimalTypeVm
    {
        [Required(ErrorMessage = "Animal Type Name is required")]
        public string TypeName { get; set; }

    }
}
