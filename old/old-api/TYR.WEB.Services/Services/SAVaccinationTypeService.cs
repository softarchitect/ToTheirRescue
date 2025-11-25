using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVaccinationTypeResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SAVaccinationTypeService : ISAVaccinationTypeService
    {
        private readonly ISAVaccinationTypeRepository _saVaccinationTypeRepository;
        public SAVaccinationTypeService(ISAVaccinationTypeRepository saVaccinationTypeRepository) => _saVaccinationTypeRepository = saVaccinationTypeRepository;
        public async Task<AddSAVaccinationTypeResponse> AddSAVaccinationTypeAsync(SAVaccinationType t) 
            => await _saVaccinationTypeRepository.AddSAVaccinationTypeAsync(t);

        public async Task<GetAvailableSAVaccinationTypeResponse> AvailableSAVaccinationType(bool isDeleted, string saVaccinationType, int saAnimalTypeId)
            => await _saVaccinationTypeRepository.AvailableSAVaccinationType(isDeleted, saVaccinationType, saAnimalTypeId);

        public async Task<bool> DeleteAsync(int id) => await _saVaccinationTypeRepository.DeleteAsync(id);

        public async Task<List<SAVaccinationType>> GetAllAsync() => await _saVaccinationTypeRepository.GetAllAsync();

        public async Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypesAsync(bool isDeleted)
            => await _saVaccinationTypeRepository.GetAllSAVaccinationTypesAsync(isDeleted);

        public async Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypesByAnimalIdAsync(bool isDeleted, int saAnimalTypeId)
            => await _saVaccinationTypeRepository.GetAllSAVaccinationTypeAnimalTypeIdAsync(isDeleted, saAnimalTypeId);

        public async Task<SAVaccinationType> GetByIdAsync(int id) => await _saVaccinationTypeRepository.GetByIdAsync(id);

        public async Task<UpdateSAVaccinationTypeResponse> UpdateSAVaccinationTypeAsync(SAVaccinationType t)
            => await _saVaccinationTypeRepository.UpdateSAVaccinationTypeAsync(t);

        public async Task<DeleteSAVaccinationTypeResponse> UpdateSAVaccinationTypeByDeletedAsync(int id, bool isDeleted)
            => await _saVaccinationTypeRepository.UpdateSAVaccinationTypeByDeletedAsync(id, isDeleted);
    }
}
