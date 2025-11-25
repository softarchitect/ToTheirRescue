using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class BehaviorService : IBehaviorService
    {
        private readonly IBehaviorRepository _behaviorRepository;
        public BehaviorService(IBehaviorRepository behaviorRepository) => _behaviorRepository = behaviorRepository;
        public async Task<AddBehaviorResponse> AddBehaviorAsync(Behavior t) => await _behaviorRepository.AddBehaviorAsync(t);

        public async Task<GetAvailableBehaviorResponse> AvailableBehavior(bool isDeleted, string behavior, int tenantId, int animaltypeId) => await _behaviorRepository.AvailableBehavior(isDeleted, behavior, tenantId, animaltypeId);
        
        public async Task<bool> DeleteAsync(int id) => await _behaviorRepository.DeleteAsync(id);
       
        public async Task<GetAllBehaviorsResponse> GetAllBehaviorsAsync(bool isDeleted, int tenantId) => await _behaviorRepository.GetAllBehaviorsAsync(isDeleted, tenantId);

        public async Task<List<Behavior>> GetAllAsync() => await _behaviorRepository.GetAllAsync();

        public async Task<Behavior> GetByIdAsync(int id) => await _behaviorRepository.GetByIdAsync(id);

        public async Task<DeleteBehaviorResponse> UpdateBehaviorByDeletedAsync(int id, bool isDeleted) => await _behaviorRepository.UpdateBehaviorByDeletedAsync(id, isDeleted);

        public async Task<UpdateBehaviorResponse> UpdateBehaviorAsync(Behavior t) => await _behaviorRepository.UpdateBehaviorAsync(t);

        public async Task<GetAllBehaviorsResponse> GetAllBehaviorsByAnimalTypeIdAsync(bool isDeleted, int animalTypeId) => await _behaviorRepository.GetAllBehaviorsAnimalTypeIdAsync(isDeleted, animalTypeId);
    }
}
