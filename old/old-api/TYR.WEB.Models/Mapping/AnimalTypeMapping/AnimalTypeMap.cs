using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalTypeViewModel;

namespace TYR.WEB.Models.Mapping.AnimalTypeMapping
{
    public class AnimalTypeMap: Profile
    {
        public AnimalTypeMap()
        {
            CreateMap<AnimalTypeVm, AnimalType>();
        }
    }
}
