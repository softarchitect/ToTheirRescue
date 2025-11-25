using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.AnimalVaccinationResult;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.Response.HealthHisotryResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/health-history")]
    [ApiController]
    public class HealthHistoryController : ControllerBase
    {
        private readonly IHealthHistoryService _healthHistoryService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public HealthHistoryController(IHealthHistoryService healthHistoryService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _healthHistoryService = healthHistoryService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpGet]
        [Route("get-health-history")]
        public async Task<IActionResult> GetHealthHistoryByAnimalId(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetHealthHistoryResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _healthHistoryService.GetHealthHistoryByAnimalIdAsync(animalId, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
