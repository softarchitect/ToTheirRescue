using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VaccinationTypeResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class VaccinationTypeService : IVaccinationTypeService
    {
        private readonly IVaccinationTypeRepository _vaccinationTypeRepository;
        public VaccinationTypeService(IVaccinationTypeRepository vaccinationTypeRepository) => _vaccinationTypeRepository = vaccinationTypeRepository;

        public async Task<AddVaccinationTypeResponse> AddVaccinationTypeAsync(VaccinationType t) => await _vaccinationTypeRepository.AddVaccinationTypeAsync(t);

        public async Task<GetAvailableVaccinationTypesResponse> AvailableVaccinationType(bool isDeleted, string vaccinationType, int tenantId, int animaltypeId) => await _vaccinationTypeRepository.AvailableVaccinationTypes(isDeleted, vaccinationType, tenantId, animaltypeId);

        public async Task<bool> DeleteAsync(int id) => await _vaccinationTypeRepository.DeleteAsync(id);

        public async Task<List<VaccinationType>> GetAllAsync() => await _vaccinationTypeRepository.GetAllAsync();

        public async Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesAsync(bool isDeleted, int tenantId) => await _vaccinationTypeRepository.GetAllVaccinationTypesAsync(isDeleted, tenantId);

        public async Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesByAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId) => await _vaccinationTypeRepository.GetAllVaccinationTypesAnimalIdAsync(isDeleted, animalTypeId, tenantId);

        public async Task<VaccinationType> GetByIdAsync(int id) => await _vaccinationTypeRepository.GetByIdAsync(id);

        public async Task<UpdateVaccinationTypeResponse> UpdateVaccinationTypeAsync(VaccinationType t) => await _vaccinationTypeRepository.UpdateVaccinationTypeAsync(t);

        public async Task<DeleteVaccinationTypeResponse> UpdateVaccinationTypeByDeletedAsync(int id, bool isDeleted) => await _vaccinationTypeRepository.UpdateVaccinationTypeByDeletedAsync(id, isDeleted);
    }
}
