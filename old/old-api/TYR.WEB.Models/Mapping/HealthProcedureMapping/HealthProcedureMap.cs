using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.HealthProcedureViewModel;

namespace TYR.WEB.Models.Mapping.HealthProcedureMapping
{
    public class HealthProcedureMap : Profile
    {
        public HealthProcedureMap()
        {
            CreateMap<HealthProcedureVm, HealthProcedure>();
        }
        
    }
}
