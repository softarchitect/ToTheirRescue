using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalBehaviorResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAnimalBehaviorService
    {
        Task<AddAnimalBehaviorResponse> UpsertAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors);
        //Task<DeleteAnimalBehaviorResponse> UpdateAnimalBehaviorByDeletedAsync(int id, bool isDeleted);
        Task<GetAllAnimalBehaviorsResponse> GetAllAnimalBehaviorsAsync(int animalId, bool isDeleted, int tenantId);
        Task<UpdateAnimalBehaviorResponse> UpdateAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors);
    }
}
