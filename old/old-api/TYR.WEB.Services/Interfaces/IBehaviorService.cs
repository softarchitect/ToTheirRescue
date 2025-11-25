using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.BehaviorResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IBehaviorService
    {
        Task<List<Behavior>> GetAllAsync();
        Task<Behavior> GetByIdAsync(int id);
        Task<AddBehaviorResponse> AddBehaviorAsync(Behavior t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteBehaviorResponse> UpdateBehaviorByDeletedAsync(int id, bool isDeleted);
        Task<GetAllBehaviorsResponse> GetAllBehaviorsAsync(bool isDeleted, int tenantId);
        Task<GetAllBehaviorsResponse> GetAllBehaviorsByAnimalTypeIdAsync(bool isDeleted, int animalTypeId);
        Task<GetAvailableBehaviorResponse> AvailableBehavior(bool isDeleted, string behavior, int tenantId, int animaltypeId);
        Task<UpdateBehaviorResponse> UpdateBehaviorAsync(Behavior t);
    }
}
