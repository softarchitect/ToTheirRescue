using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;

namespace TYR.WEB.Models.Mapping.AnimalMilestoneMapping
{
    public class AnimalMilestoneMap : Profile
    {
        public AnimalMilestoneMap()
        {
            CreateMap<AnimalMilestoneVm, AnimalMilestone>();
            CreateMap<AnimalMilestoneUpdateVm, AnimalMilestone>();
        }
    }
}
