using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.QueryResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IQueryService
    {
        Task<GetAnimalMilestoneQueryResponse> GetAnimalMilestoneQueryAsync(string milestoneType, string animalTypeName, DateTime? milestoneStartDate, DateTime? milestoneEndDate, int tenantId);
    }
}
