using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.DiaryViewModel;
using TYR.WEB.Models.ViewModels.HealthNoteViewModel;

namespace TYR.WEB.Models.Mapping.HealthNoteMapping
{
    public class HealthNoteMap: Profile
    {
        public HealthNoteMap()
        {
            CreateMap<HealthNoteVm, HealthNote>();
        }
    }
}
