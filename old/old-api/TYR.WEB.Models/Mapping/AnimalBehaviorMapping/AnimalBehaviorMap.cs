using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalBehaviorViewModel;
using TYR.WEB.Models.ViewModels.BehaviorViewModel;

namespace TYR.WEB.Models.Mapping.AnimalBehaviorMapping
{
    public class AnimalBehaviorMap: Profile
    {
        public AnimalBehaviorMap()
        {
            CreateMap<AnimalBehaviorVm, AnimalBehavior>();
            CreateMap<AnimalBehavior, AnimalBehaviorVm>();
            //CreateMap<List<AnimalBehaviorVm>, List<AnimalBehavior>>();
            //CreateMap<List<AnimalBehavior>, List<AnimalBehaviorVm>>();

        }
    }
}
