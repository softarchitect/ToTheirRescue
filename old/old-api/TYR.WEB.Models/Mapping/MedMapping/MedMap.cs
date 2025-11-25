using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;
using TYR.WEB.Models.ViewModels.DiaryViewModel;
using TYR.WEB.Models.ViewModels.MedViewModel;

namespace TYR.WEB.Models.Mapping.MedMapping
{
    public class MedMap: Profile
    {
        public MedMap()
        {
            CreateMap<MedVm, Med>();
            CreateMap<MedUpdateVm, Med>();
        }
    }
}
