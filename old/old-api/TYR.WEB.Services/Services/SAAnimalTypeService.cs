using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.Response.SAAnimalTypeResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SAAnimalTypeService : ISAAnimalTypeService
    {
        private readonly ISAAnimalTypeRepository _sAAnimalTypeRepository;
        public SAAnimalTypeService(ISAAnimalTypeRepository sAAnimalTypeRepository) 
            => _sAAnimalTypeRepository = sAAnimalTypeRepository;
        public async Task<AddSAAnimalTypeResponse> AddSAAnimalTypeAsync(SAAnimalType t) 
            => await _sAAnimalTypeRepository.AddSAAnimalTypeAsync(t);

        public async Task<GetAvailableSAAnimalTypeResponse> AvailableSAAnimalType(bool isDeleted, string typeName)
            => await _sAAnimalTypeRepository.AvailableSAAnimalType(isDeleted, typeName);

        public async Task<bool> DeleteAsync(int id)
            => await _sAAnimalTypeRepository.DeleteAsync(id);

        public async Task<List<SAAnimalType>> GetAllAsync()
            => await _sAAnimalTypeRepository.GetAllAsync();

        public async Task<GetSAAnimalTypeResponse> GetAllSAAnimalTypeAsync(bool isDeleted)
            => await _sAAnimalTypeRepository.GetAllSAAnimalTypeAsync(isDeleted);

        public async Task<SAAnimalType> GetByIdAsync(int id)
            => await _sAAnimalTypeRepository.GetByIdAsync(id);

        public async Task<SAAnimalType> GetSAAnimalTypeByAnimalTypeNameAsync(string typeName)
            => await _sAAnimalTypeRepository.GetSAAnimalTypeByAnimalTypeNameAsync(typeName);

        public async Task<UpdateSAAnimalTypeResponse> UpdateSAAnimalTypeAsync(SAAnimalType t)
            => await _sAAnimalTypeRepository.UpdateSAAnimalTypeAsync(t);

        public async Task<DeleteSAAnimalTypeResponse> UpdateSAAnimalTypeByDeletedAsync(int id, bool isDeleted)
            => await _sAAnimalTypeRepository.UpdateSAAnimalTypeByDeletedAsync(id, isDeleted);
    }
}
