using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthProcedureResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class HealthProcedureService : IHealthProcedureService
    {
        private readonly IHealthProcedureRepository _healthProcedureRepository;
        public HealthProcedureService(IHealthProcedureRepository healthProcedureRepository) => _healthProcedureRepository = healthProcedureRepository;
        public async Task<AddHealthProcedureResponse> AddHealthProcedureAsync(HealthProcedure t) => await _healthProcedureRepository.AddHealthProcedureAsync(t);

        public async Task<GetAvailableHealthProcedureResponse> AvailableHealthProcedure(bool isDeleted, string healthProcedure, int tenantId, int animaltypeId) => await _healthProcedureRepository.AvailableHealthProcedure(isDeleted, healthProcedure, tenantId, animaltypeId);

        public async Task<bool> DeleteAsync(int id) => await _healthProcedureRepository.DeleteAsync(id);

        public async Task<List<HealthProcedure>> GetAllAsync() => await _healthProcedureRepository.GetAllAsync();

        public async Task<GetAllHealthProcedureResponse> GetAllHealthProcedurersAsync(bool isDeleted, int tenantId) => await _healthProcedureRepository.GetAllHealthProceduresAsync(isDeleted, tenantId);

        public async Task<GetAllHealthProcedureResponse> GetAllHealthProceduresByAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId) => await _healthProcedureRepository.GetAllHealthProceduresAnimalIdAsync(isDeleted, animalTypeId, tenantId);

        public async Task<HealthProcedure> GetByIdAsync(int id) => await _healthProcedureRepository.GetByIdAsync(id);

        public async Task<UpdateHealthProcedureResponse> UpdateHealthProcedureAsync(HealthProcedure t) => await _healthProcedureRepository.UpdateHealthProcedureAsync(t);

        public async Task<DeleteHealthProcedureResponse> UpdateHealthProcedureByDeletedAsync(int id, bool isDeleted) => await _healthProcedureRepository.UpdateHealthProcedureByDeletedAsync(id, isDeleted);
    }
}
