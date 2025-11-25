using System;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalViewModel;
namespace TYR.WEB.Models.Mapping.AnimalMapping
{
    public class AnimalMap : Profile
    {
        public AnimalMap()
        {
            CreateMap<AddAnimalVM, Animal>();
            CreateMap<IntakeMilestoneVM, AnimalMilestone>();
            CreateMap<BirthMilestoneVM, AnimalMilestone>();
            CreateMap<AnimalMilestone, IntakeMilestoneVM>();
            CreateMap<AnimalMilestone, BirthMilestoneVM>();
            CreateMap<UpdateAnimalVm, Animal>();
            CreateMap<ListAnimalResponse, Animal>();
            CreateMap<Animal, AnimalAnimalTypeVm>();

        }
    }
}
