using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.BehaviorResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IBehaviorRepository : IRepositoryBase<Behavior>
    {
        Task<AddBehaviorResponse> AddBehaviorAsync(Behavior t);
        Task<DeleteBehaviorResponse> UpdateBehaviorByDeletedAsync(int id, bool isDeleted);
        Task<GetAllBehaviorsResponse> GetAllBehaviorsAsync(bool isDeleted, int tenantId);
        Task<GetAllBehaviorsResponse> GetAllBehaviorsAnimalTypeIdAsync(bool isDeleted, int animalTypeId);
        Task<GetAvailableBehaviorResponse> AvailableBehavior(bool isDeleted, string behavior, int tenantId, int animaltypeId);
        Task<UpdateBehaviorResponse> UpdateBehaviorAsync(Behavior t);
    }
}
