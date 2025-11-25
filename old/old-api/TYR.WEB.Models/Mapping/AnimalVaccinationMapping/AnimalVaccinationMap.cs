using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;

namespace TYR.WEB.Models.Mapping.AnimalVaccinationMapping
{
    public class AnimalVaccinationMap: Profile
    {
        public AnimalVaccinationMap()
        {
            CreateMap<AnimalVaccinationVm, AnimalVaccination>();
            CreateMap<AnimalVaccinationUpdateVm, AnimalVaccination>();
        }
    }
}
