using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.BehaviorViewModel;

namespace TYR.WEB.Models.Mapping.BehaviorMapping
{
    public class BehaviorMap : Profile
    {
        public BehaviorMap()
        {
            CreateMap<BehaviorVm, Behavior>();
        }
    }
}
