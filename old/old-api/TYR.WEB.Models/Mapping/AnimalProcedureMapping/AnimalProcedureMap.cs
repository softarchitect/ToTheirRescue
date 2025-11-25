using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;

namespace TYR.WEB.Models.Mapping.AnimalProcedureMapping
{
    public class AnimalProcedureMap: Profile
    {
        public AnimalProcedureMap() 
        {
            CreateMap<AnimalProcedureVm, AnimalProcedure>();
            CreateMap<AnimalProcedureUpdateVm, AnimalProcedure>();
        }
    }
}
