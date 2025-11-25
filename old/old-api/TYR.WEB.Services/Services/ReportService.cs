using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.ReportResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        public ReportService(IReportRepository reportRepository) => _reportRepository = reportRepository;
        public async Task<GetAnimalHealthReportResponse> GetAnimalHealthReportAsync(int animalId, int tenantId) => 
            await _reportRepository.GetAnimalHealthReportAsync(animalId, tenantId);
    }
}
