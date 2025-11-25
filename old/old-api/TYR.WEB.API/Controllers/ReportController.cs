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
    [Route("api/report")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public ReportController(IReportService reportService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _reportService = reportService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpGet]
        [Route("get-animal-health-report")]
        public async Task<IActionResult> GetAnimalHealthReport(int animalId)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _reportService.GetAnimalHealthReportAsync(animalId, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
