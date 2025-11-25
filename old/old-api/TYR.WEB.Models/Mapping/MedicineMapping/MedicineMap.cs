using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.MedicineViewModel;

namespace TYR.WEB.Models.Mapping.MedicineMapping
{
    public class MedicineMap :Profile
    {
        public MedicineMap()
        {
            CreateMap<MedicineVm, Medicine>();
        }
    }
}
