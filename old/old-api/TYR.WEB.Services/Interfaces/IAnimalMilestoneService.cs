using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalMilestoneResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAnimalMilestoneService
    {
        Task<List<AnimalMilestone>> GetAllAsync();
        Task<AnimalMilestone> GetByIdAsync(int id);
        Task<AddAnimalMilestoneResponse> AddAnimalMilestoneAsync(AnimalMilestone t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteAnimalMilestoneResponse> UpdateAnimalMilestoneByDeletedAsync(int id, bool isDeleted);
        Task<GetAnimalMilestonesResponse> GetAllAnimalMilestonesAsync(bool isDeleted, int tenantId);
        Task<UpdateAnimalMilestoneResponse> UpdateAnimalMilestoneAsync(AnimalMilestone t);
        Task<AnimalMilestone> GetAnimalMilestoneByAnimalIdAndType(int animalId, string type);
        Task<bool> DeleteMileStoneByAnimal(int animalId);
        Task<AnimalMilestonesCountResponse> GetAnimalMilestoneCountByAnimalId(int animalId);
        Task<GetAnimalMilestonesResponse> GetAnimalMilestoneByAnimalId(int animalId, int limit, int page, bool isDeleted);
        Task<List<AnimalMilestone>> GetAnimalMilestoneByPCO(int PcoID);
        Task<AnimalMilestone> GetLastMilestoneByAnimalIdAsync(int animalId);
        Task<GetPcoLinkMilestoneVolunteerDonationResponse> GetPcoLinkIntakeMilestoneVolunteerDonationAsync(int pcoId, int tenantId);
    }
}
