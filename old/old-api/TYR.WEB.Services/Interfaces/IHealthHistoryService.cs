using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.HealthHisotryResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IHealthHistoryService
    {
        Task<GetHealthHistoryResponse> GetHealthHistoryByAnimalIdAsync(int animalId, int tenantId);
    }
}
