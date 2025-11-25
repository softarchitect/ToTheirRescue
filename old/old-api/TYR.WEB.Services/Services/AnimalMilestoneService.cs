using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalMilestoneResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalMilestoneService : IAnimalMilestoneService
    {
        private readonly IAnimalMilestoneRepository _animalMilestoneRepository;
        public AnimalMilestoneService(IAnimalMilestoneRepository animalMilestoneRepository) => _animalMilestoneRepository = animalMilestoneRepository;

        public async Task<AddAnimalMilestoneResponse> AddAnimalMilestoneAsync(AnimalMilestone t) => await _animalMilestoneRepository.AddAnimalMilestoneAsync(t);

        public async Task<bool> DeleteAsync(int id) => await _animalMilestoneRepository.DeleteAsync(id);

        public async Task<GetAnimalMilestonesResponse> GetAllAnimalMilestonesAsync(bool isDeleted, int tenantId) => await _animalMilestoneRepository.GetAnimalMilestonesAsync(isDeleted, tenantId);

        public async Task<List<AnimalMilestone>> GetAllAsync() => await _animalMilestoneRepository.GetAllAsync();

        public async Task<AnimalMilestone> GetByIdAsync(int id) => await _animalMilestoneRepository.GetByIdAsync(id);

        public async Task<UpdateAnimalMilestoneResponse> UpdateAnimalMilestoneAsync(AnimalMilestone t) => await _animalMilestoneRepository.UpdateAnimalMilestoneAsync(t);

        public async Task<DeleteAnimalMilestoneResponse> UpdateAnimalMilestoneByDeletedAsync(int id, bool isDeleted) => await _animalMilestoneRepository.UpdateAnimalMilestoneByDeletedAsync(id, isDeleted);
        public async Task<AnimalMilestone> GetAnimalMilestoneByAnimalIdAndType(int animalId, string type) => await _animalMilestoneRepository.GetAnimalMilestoneByAnimalIdAndType(animalId, type);
        public async Task<bool> DeleteMileStoneByAnimal(int animalId) => await _animalMilestoneRepository.DeleteMileStoneByAnimal(animalId);
        public async Task<AnimalMilestonesCountResponse> GetAnimalMilestoneCountByAnimalId(int animalId) => await _animalMilestoneRepository.GetAnimalMilestoneCountByAnimalId(animalId);
        public async Task<GetAnimalMilestonesResponse> GetAnimalMilestoneByAnimalId(int animalId, int limit, int page, bool isDeleted) => await _animalMilestoneRepository.GetAnimalMilestoneByAnimalId(animalId, limit, page, isDeleted);
        public async Task<List<AnimalMilestone>> GetAnimalMilestoneByPCO(int PcoID) => await _animalMilestoneRepository.GetAnimalMilestoneByPCO(PcoID);
        public async Task<AnimalMilestone> GetLastMilestoneByAnimalIdAsync(int animalId) => await _animalMilestoneRepository.GetLastMilestoneByAnimalIdAsync(animalId);
        public async Task<GetPcoLinkMilestoneVolunteerDonationResponse> GetPcoLinkIntakeMilestoneVolunteerDonationAsync(int pcoId, int tenantId) => await _animalMilestoneRepository.GetPcoLinkIntakeMilestoneVolunteerDonationAsync(pcoId, tenantId);
    }
}
