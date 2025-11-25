using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.HealthHisotryResult;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.Response.QueryResult;
using System;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/query")]
    [ApiController]
    public class QueryController : ControllerBase
    {
        private readonly IQueryService _queryService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public QueryController(IQueryService queryService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _queryService = queryService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpGet]
        [Route("get-animal-milestone-query")]
        public async Task<IActionResult> GetAnimalMilestoneQuery(string milestoneType, string animalTypeName, DateTime? milestoneStartDate, DateTime? milestoneEndDate)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _queryService.GetAnimalMilestoneQueryAsync(milestoneType, animalTypeName, milestoneStartDate, milestoneEndDate, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
