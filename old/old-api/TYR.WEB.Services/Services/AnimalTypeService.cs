using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalTypeService : IAnimalTypeService
    {
        private readonly IAnimalTypeRepository _animalTypeRepository;
        
        public AnimalTypeService(IAnimalTypeRepository animalTypeRepository) => _animalTypeRepository = animalTypeRepository;
        public async Task<AddAnimalTypeResponse> AddAnimalTypeAsync(AnimalType t) => await _animalTypeRepository.AddAnimalTypeAsync(t);

        public async Task<GetAvailableAnimalTypeResponse> AvailableAnimalType(bool isDeleted, string typeName, int tenantId, string roleName) => await _animalTypeRepository.AvailableAnimalType(isDeleted, typeName, tenantId, roleName);
        
        public async Task<bool> DeleteAsync(int id) => await _animalTypeRepository.DeleteAsync(id);

        public async Task<GetAnimalTypesResponse> GetAllAnimalTypesAsync(bool isDeleted, int tenantId, string roleName) => await _animalTypeRepository.GetAllAnimalTypesAsync(isDeleted, tenantId, roleName);

        public async Task<List<AnimalType>> GetAllAsync() => await _animalTypeRepository.GetAllAsync();

        public async Task<AnimalType> GetByIdAsync(int id) => await _animalTypeRepository.GetByIdAsync(id);

        public async Task<DeleteAnimalTypeResponse> UpdateAnimalTypeByDeletedAsync(int id, bool isDeleted) => await _animalTypeRepository.UpdateAnimalTypeByDeletedAsync(id, isDeleted);

        public async Task<UpdateAnimalTypeResponse> UpdateAnimalTypeAsync(AnimalType t) => await _animalTypeRepository.UpdateAnimalTypeAsync(t);

    }
}
