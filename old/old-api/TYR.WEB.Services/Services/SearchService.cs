using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.SearchResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SearchService: ISearchService
    {
        private readonly ISearchRepository _searchRepository;
        public SearchService(ISearchRepository searchRepository) => _searchRepository = searchRepository;

        public async Task<GetAnimalMilestoneSearchResponse> GetAnimalMilestoneSearchAsync(string milestoneType, int acquisitionWayId, int animalTypeId, string otherRescueIdNo, int pcoId, string note, int tenantId)
          => await _searchRepository.GetAnimalMilestoneSearchAsync(milestoneType, acquisitionWayId, animalTypeId, otherRescueIdNo, pcoId, note, tenantId);

    }
}
