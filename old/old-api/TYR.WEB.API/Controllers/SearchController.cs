using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Threading.Tasks;
using System;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/search")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public SearchController(ISearchService searchService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _searchService = searchService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        [HttpGet]
        [Route("get-animal-milestone-search")]
        public async Task<IActionResult> GetAnimalMilestoneSearch(string milestoneType, int? acquisitionWayId, int? animalTypeId, string otherRescueIdNo, int? pcoId, string note)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            otherRescueIdNo = otherRescueIdNo ?? string.Empty;
            note = note ?? string.Empty;
            milestoneType = milestoneType ?? string.Empty;
            acquisitionWayId = acquisitionWayId.HasValue ? acquisitionWayId.Value : 0;
            animalTypeId = animalTypeId.HasValue ? animalTypeId.Value : 0;
            pcoId = pcoId.HasValue ? pcoId.Value : 0;
            var result = await _searchService.GetAnimalMilestoneSearchAsync(milestoneType, acquisitionWayId.Value, animalTypeId.Value, otherRescueIdNo, pcoId.Value, note, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
