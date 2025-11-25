using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.Response.HealthHisotryResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IHealthHistoryRepository: IRepositoryBase<HealthNote>
    {
        Task<GetHealthHistoryResponse> GetHealthHistoryByAnimalIdAsync(int animalId, int tenantId);
    }
}
