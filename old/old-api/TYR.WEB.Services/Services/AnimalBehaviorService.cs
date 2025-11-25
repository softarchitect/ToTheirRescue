using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.Web.Repositories.Repositories;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalBehaviorResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalBehaviorService : IAnimalBehaviorService
    {
        private readonly IAnimalBehaviorRepository _animalBehaviorRepository;
        public AnimalBehaviorService(IAnimalBehaviorRepository animalBehaviorRepository) => _animalBehaviorRepository = animalBehaviorRepository;
        public async Task<AddAnimalBehaviorResponse> UpsertAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors) => await _animalBehaviorRepository.UpsertAnimalBehaviorAsync(animalBehaviors);
        
        public async Task<GetAllAnimalBehaviorsResponse> GetAllAnimalBehaviorsAsync(int animalId, bool isDeleted, int tenantId) => await _animalBehaviorRepository.GetAllAnimalBehaviorsAsync(animalId, isDeleted, tenantId);

        public async Task<UpdateAnimalBehaviorResponse> UpdateAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors) => await _animalBehaviorRepository.UpdateAnimalBehaviorAsync(animalBehaviors);

        //public Task<DeleteAnimalBehaviorResponse> UpdateAnimalBehaviorByDeletedAsync(int id, bool isDeleted)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
