using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.SAAnimalTypeViewModel;

namespace TYR.WEB.Models.Mapping.SAAnimalTypeMapping
{
    public class SAAnimalTypeMap: Profile
    {
        public SAAnimalTypeMap() {
            CreateMap<SAAnimalTypeVm, SAAnimalType>();
        }
    }
}
