using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalBehaviorResult;
using TYR.WEB.Models.Response.BehaviorResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IAnimalBehaviorRepository : IRepositoryBase<AnimalBehavior>
    {
        Task<AddAnimalBehaviorResponse> UpsertAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors);
        Task<DeleteAnimalBehaviorResponse> UpdateAnimalBehaviorByDeletedAsync(int id, bool isDeleted);
        Task<GetAllAnimalBehaviorsResponse> GetAllAnimalBehaviorsAsync(int animalId, bool isDeleted, int tenantId);
        //Task<GetAllAnimalBehaviorsResponse> GetAllAnimalBehaviorsAnimalIdAsync(bool isDeleted, int animalTypeId);
        //Task<GetAvailableAnimalBehaviorResponse> AvailableAnimalBehavior(bool isDeleted, string behavior, int tenantId, int animaltypeId);
        Task<UpdateAnimalBehaviorResponse> UpdateAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors);
    }
}
