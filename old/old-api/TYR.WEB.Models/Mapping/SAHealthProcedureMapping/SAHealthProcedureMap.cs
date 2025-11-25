using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.HealthProcedureViewModel;
using TYR.WEB.Models.ViewModels.SAHealthProcedureViewModel;

namespace TYR.WEB.Models.Mapping.SAHealthProcedureMapping
{
    public class SAHealthProcedureMap: Profile
    {
        public SAHealthProcedureMap()
        {
            CreateMap<SAHealthProcedureVm, SAHealthProcedure>();
        }
    }
}
