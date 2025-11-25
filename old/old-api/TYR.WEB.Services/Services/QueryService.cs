using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.QueryResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class QueryService : IQueryService
    {
        private readonly IQueryRepository _queryRepository;
        public QueryService(IQueryRepository queryRepository) => _queryRepository = queryRepository;
        public async Task<GetAnimalMilestoneQueryResponse> GetAnimalMilestoneQueryAsync(string milestoneType, string animalTypeName, DateTime? milestoneStartDate, DateTime? milestoneEndDate, int tenantId)
            => await _queryRepository.GetAnimalMilestoneQueryAsync(milestoneType, animalTypeName, milestoneStartDate, milestoneEndDate, tenantId);
    }
}
