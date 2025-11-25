using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalNameService : IAnimalNameService
    {
        private readonly IAnimalNameRepository _animalNameRepository;
        public AnimalNameService(IAnimalNameRepository animalNameRepository) => _animalNameRepository = animalNameRepository;
        public async Task<AnimalName> AddAnimalNameAsync(AnimalName t) => await _animalNameRepository.AddAnimalNameAsync(t);
        public async Task<string> GetAnimalNameSuggestion(string gender) => await _animalNameRepository.GetAnimalNameSuggestion(gender);
    }
}
