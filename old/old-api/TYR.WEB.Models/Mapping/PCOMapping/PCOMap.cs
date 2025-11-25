using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using TYR.WEB.Models.ViewModels.PCO;
using TYR.WEB.DataAccess.Entities;
namespace TYR.WEB.Models.Mapping.PCOMapping
{
   public class PCOMap : Profile
    {
       public PCOMap()
        {
            CreateMap<AddPCOVm, PCO>();
            CreateMap<PCO, AddPCOVm>();
            CreateMap<PCO, PCOListVm>();
            CreateMap<PCO, PcoDropDownVM>();
        }
    }
}
