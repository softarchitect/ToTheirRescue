using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthNoteResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class HealthNoteService : IHealthNoteService
    {
        private readonly IHealthNoteRepository _healthNoteRepository;
        public HealthNoteService(IHealthNoteRepository healthNoteRepository)
        {
            _healthNoteRepository = healthNoteRepository;
        }
        public async Task<AddHealthNoteResponse> AddHealthNoteAsync(HealthNote healthNote) => await _healthNoteRepository.AddHealthNoteAsync(healthNote);

        public async Task<GetHealthNoteResponse> GetHealthNoteByAnimalIdAsync(int animalId, bool isDeleted, int tenantId) => await _healthNoteRepository.GetHealthNoteByAnimalIdAsync(animalId, isDeleted, tenantId);

        public async Task<HealthNote> GetHealthNoteByIdAsync(int id) => await _healthNoteRepository.GetByIdAsync(id);

        //public async Task<GetHealthNoteResponse> GetHealthNoteByTenantIdAsync(bool isDeleted, int tenantId) => await _healthNoteRepository.GetHealthNoteByTenantIdAsync(!isDeleted, tenantId);

        public async Task<UpdateHealthNoteResponse> UpdateHealthNoteAsync(int id, HealthNote healthNote) => await _healthNoteRepository.UpdateHealthNoteAsync(id, healthNote);

        public async Task<DeleteHealthNoteResponse> UpdateHealthNoteByDeletedAsync(int id, bool isDeleted) => await _healthNoteRepository.UpdateHealthNoteByDeletedAsync(id, isDeleted);
    }
}
