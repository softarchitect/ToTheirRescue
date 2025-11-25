using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalService : IAnimalService
    {
        private readonly IAnimalRepository _animalsRepository;
        public AnimalService(IAnimalRepository animalRepository) => _animalsRepository = animalRepository;
        public async Task<AddAnimalResponse> AddAnimalAsync(Animal animal) =>await _animalsRepository.AddAnimalAsync(animal);
        public async Task<AnimalPagedResponse> GetAnimalSearchFilterPagedAsync(int tenantId, bool isDeleted, string searchText, bool isCurrentResident, int limit, int page) => await _animalsRepository.GetAnimalSearchFilterPagedAsync(tenantId, isDeleted, searchText, isCurrentResident, limit, page);
        public async Task<UpdateAnimalResponse> UpdateAnimalAsync(Animal animal, int id, string updatedBy) => await _animalsRepository.UpdateAnimalAsync(animal, id, updatedBy);
        public async Task<DeleteAnimalResponse> DeleteAnimalAsync(int id, string updatedBy) => await _animalsRepository.DeleteAnimalAsync(id, updatedBy);
        public async Task<Animal> GetAnimalByIdAsync(int id) => await _animalsRepository.GetByIdAsync(id);
        public async Task<AnimalSearchAutoCompleteListResponse> AnimalSearchAutoCompleteAsync(int tenantId, string searchText, int limit) => await _animalsRepository.AnimalSearchAutoCompleteAsync(tenantId, searchText, limit);
        public async Task<int> GetLastAnimalIdAsync(int tenantId) => await _animalsRepository.GetLastAnimalIdAsync(tenantId);
        public async Task<AnimalCountResponse> GetAnimalCountAsync(int tenantId) => await _animalsRepository.GetAnimalCountAsync(tenantId);
        public async Task<GetAnimalListResponse> GetAnimalListByIdsAsync(List<int> animalIds) => await _animalsRepository.GetAnimalListByIdsAsync(animalIds);
        public async Task<UpdateAnimalLocationResponse> UpdateAnimalLocationAsync(List<int> animalIds, string location) => await _animalsRepository.UpdateAnimalLocationAsync(animalIds, location);
        public async Task<UpdateAnimalPublicityBlurbResponse> UpdateAnimalPublicityBlurbAsync(int animalId, string publicityBlurb) => await _animalsRepository.UpdateAnimalPublicityBlurbAsync(animalId, publicityBlurb);
        public async Task<UpdateAnimalDietResponse> UpdateAnimalDietAsync(List<int> animalIds, string diet) => await _animalsRepository.UpdateAnimalDietAsync(animalIds, diet);
        public async Task<GetAnimalDietResponse> GetAnimalDietByIdAsync(int animalId) => await _animalsRepository.GetAnimalDietByIdAsync(animalId);
        public async Task<GetAnimalPublicityBlurbResponse> GetAnimalPublicityBlurbByIdAsync(int animalId) => await _animalsRepository.GetAnimalPublicityBlurbByIdAsync(animalId);
    }

}
