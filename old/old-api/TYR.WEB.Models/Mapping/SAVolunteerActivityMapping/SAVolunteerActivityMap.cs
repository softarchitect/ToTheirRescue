using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.SAVolunteerActivityViewModel;
using TYR.WEB.Models.ViewModels.VolunteerActivityViewModel;

namespace TYR.WEB.Models.Mapping.SAVolunteerActivityMapping
{
    public class SAVolunteerActivityMap: Profile
    {
        public SAVolunteerActivityMap()
        {
            CreateMap<SAVolunteerActivityVm, SAVolunteerActivity>();
        }
    }
}
