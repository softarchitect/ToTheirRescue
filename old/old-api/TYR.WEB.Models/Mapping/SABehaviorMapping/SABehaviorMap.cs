using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.SABehaviorViewModel;

namespace TYR.WEB.Models.Mapping.SABehaviorMapping
{
    public class SABehaviorMap: Profile
    {
        public SABehaviorMap() {
            CreateMap<SABehaviorVm, SABehavior>();
        }
    }
}
