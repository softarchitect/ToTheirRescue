using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Mapping.AnimalVaccinationMapping;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;
using TYR.WEB.Models.ViewModels.DiaryViewModel;

namespace TYR.WEB.Models.Mapping.DiaryMapping
{
    public class DiaryMap: Profile
    {
        public DiaryMap()
        {
            CreateMap<DiaryVm, Diary>();
        }
    }
}
