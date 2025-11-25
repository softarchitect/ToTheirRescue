using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.ReportResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IReportService
    {
        Task<GetAnimalHealthReportResponse> GetAnimalHealthReportAsync(int animalId, int tenantId);
    }
}
