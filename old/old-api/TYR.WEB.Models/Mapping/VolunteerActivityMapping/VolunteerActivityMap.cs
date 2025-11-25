using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.VolunteerActivityViewModel;

namespace TYR.WEB.Models.Mapping.VolunteerActivityMapping
{
    public class VolunteerActivityMap : Profile
    {
        public VolunteerActivityMap()
        {
            CreateMap<VolunteerActivityVm, VolunteerActivity>();
        }
    }
}
