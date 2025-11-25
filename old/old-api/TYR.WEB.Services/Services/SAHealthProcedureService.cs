using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAHealthProcedureResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SAHealthProcedureService : ISAHealthProcedureService
    {
        private readonly ISAHealthProcedureRepository _saHealthProcedureRepository;
        public SAHealthProcedureService(ISAHealthProcedureRepository saHealthProcedureRepository) => _saHealthProcedureRepository = saHealthProcedureRepository;
        public async Task<AddSAHealthProcedureResponse> AddSAHealthProcedureAsync(SAHealthProcedure t)
            => await _saHealthProcedureRepository.AddSAHealthProcedureAsync(t);

        public async Task<GetAvailableSAHealthProcedureResponse> AvailableSAHealthProcedure(bool isDeleted, string saHealthProcedure, int saAnimalTypeId)
            => await _saHealthProcedureRepository.AvailableSAHealthProcedure(isDeleted, saHealthProcedure, saAnimalTypeId); 

        public async Task<bool> DeleteAsync(int id) => await _saHealthProcedureRepository.DeleteAsync(id);

        public async Task<List<SAHealthProcedure>> GetAllAsync() => await _saHealthProcedureRepository.GetAllAsync();

        public async Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProcedurersAsync(bool isDeleted)
            => await _saHealthProcedureRepository.GetAllSAHealthProceduresAsync(isDeleted);

        public async Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProceduresByAnimalIdAsync(bool isDeleted, int saAnimalTypeId)
            => await _saHealthProcedureRepository.GetAllSAHealthProceduresAnimalTypeIdAsync(isDeleted, saAnimalTypeId);

        public async Task<SAHealthProcedure> GetByIdAsync(int id) => await _saHealthProcedureRepository.GetByIdAsync(id);

        public async Task<UpdateSAHealthProcedureResponse> UpdateSAHealthProcedureAsync(SAHealthProcedure t)
            => await _saHealthProcedureRepository.UpdateSAHealthProcedureAsync(t);

        public async Task<DeleteSAHealthProcedureResponse> UpdateSAHealthProcedureByDeletedAsync(int id, bool isDeleted)
            => await _saHealthProcedureRepository.UpdateSAHealthProcedureByDeletedAsync(id, isDeleted);
    }
}
