using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AnimalTypeViewModel
{
    public class AnimalTypeVm
    {
        [Required(ErrorMessage = "Animal Type Name is required")]
        public string TypeName { get; set; }

        //[Required(ErrorMessage = "Super Admin Animal Type Identifier is required")]
        //public int SAAnimalTypeId { get; set; }
        [Required(ErrorMessage = "Role Name is required")]
        public string RoleName { get; set; }
    }
}
