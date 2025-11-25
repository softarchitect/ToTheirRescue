using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.HealthHisotryResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class HealthHistoryService : IHealthHistoryService
    {
        private readonly IHealthHistoryRepository _healthHistoryRepository;
        public HealthHistoryService(IHealthHistoryRepository healthHistoryRepository) => _healthHistoryRepository = healthHistoryRepository;
        public async Task<GetHealthHistoryResponse> GetHealthHistoryByAnimalIdAsync(int animalId, int tenantId) => await _healthHistoryRepository.GetHealthHistoryByAnimalIdAsync(animalId, tenantId);
    }
}
