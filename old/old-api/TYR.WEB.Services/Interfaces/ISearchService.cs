using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.SearchResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ISearchService
    {
        Task<GetAnimalMilestoneSearchResponse> GetAnimalMilestoneSearchAsync(string milestoneType, int acquisitionWayId, int animalTypeId, string otherRescueIdNo, int pcoId, string note, int tenantId);
    }
}
