using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.MedicineViewModel;
using TYR.WEB.Models.ViewModels.SAMedicineViewModel;

namespace TYR.WEB.Models.Mapping.SAMedicineMapping
{
    public class SAMedicineMap: Profile
    {
        public SAMedicineMap()
        {
            CreateMap<SAMedicineVm, SAMedicine>();
        }
    }
}
