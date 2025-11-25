using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.QueryResult;
using TYR.WEB.Models.Response.ReportResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IReportRepository: IRepositoryBase<Animal>
    {
        Task<GetAnimalHealthReportResponse> GetAnimalHealthReportAsync(int animalId, int tenantId);
    }
}
