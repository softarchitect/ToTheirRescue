using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.VaccinationTypeViewModel;

namespace TYR.WEB.Models.Mapping.VaccinationTypeMapping
{
    public class VaccinationTypeMap : Profile
    {
        public VaccinationTypeMap()
        {
            CreateMap<VaccinationTypeVm, VaccinationType>();
        }
    }
}
