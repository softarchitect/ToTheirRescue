using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.VolunteerViewModel;

namespace TYR.WEB.Models.Mapping.VolunteerMapping
{
    public class VolunteerMap: Profile
    {
        public VolunteerMap() {
            CreateMap<VolunteerVm, Volunteer>();
            CreateMap<Volunteer, VolunteerVm>();
        }
    }
}
