using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.SAHealthProcedureViewModel;
using TYR.WEB.Models.ViewModels.SAVaccinationTypeViewModel;

namespace TYR.WEB.Models.Mapping.SAVaccinationTypeMapping
{
    public class SAVaccinationTypeMap: Profile
    {
        public SAVaccinationTypeMap()
        {
            CreateMap<SAVaccinationTypeVm, SAVaccinationType>();
        }
    }
}
