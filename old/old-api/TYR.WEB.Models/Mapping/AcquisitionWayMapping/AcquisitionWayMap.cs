using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AcquisitionWayViewModel;

namespace TYR.WEB.Models.Mapping.AcquisitionWayMapping
{
    public class AcquisitionWayMap : Profile
    {
        public AcquisitionWayMap()
        {
            CreateMap<AcquisitionWayVm, AcquisitionWay>();
        }
    }
}
