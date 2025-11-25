using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.VolunteerViewModel;

namespace TYR.WEB.Models.Mapping.VolunteerPersonActivityMapping
{
    public class VolunteerPersonActivityMap: Profile
    {
        public VolunteerPersonActivityMap() {
            CreateMap<VolunteerVm, VolunteerPersonActivity>();
            CreateMap<VolunteerPersonActivity, VolunteerVm>();
        }
    }
}
