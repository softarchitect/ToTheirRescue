using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthProcedureResult;
using TYR.WEB.Models.ViewModels.HealthProcedureViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/health-procedure")]
    [ApiController]
    public class HealthProcedureController : ControllerBase
    {
        private readonly IHealthProcedureService _healthProcedureService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public HealthProcedureController(IHealthProcedureService healthProcedureService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _healthProcedureService = healthProcedureService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }
        [HttpPost]
        [Route("create-health-procedure")]
        public async Task<IActionResult> AddHealthProcedure([FromBody] HealthProcedureVm healthProcedureVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<HealthProcedure>(healthProcedureVm);
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _healthProcedureService.AvailableHealthProcedure(false, model.Kind, tenantId, healthProcedureVm.AnimalTypeId);
                if (result.Success && result.Data.IsAvailable.Equals(false))
                {
                    return Ok(result);
                }
                else if (result.Success.Equals(false))
                {
                    return BadRequest(result);
                }

                model.EnteredBy = _userName;
                model.TenantId = tenantId;
                model.DateEntered = DateTime.Now;
                var response = await _healthProcedureService.AddHealthProcedureAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddHealthProcedureResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Health Procedure request."
                    }
            });
        }

        [HttpGet]
        [Route("get-health-procedures")]
        public async Task<IActionResult> GetAllActiveHealthProcedures()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _healthProcedureService.GetAllHealthProcedurersAsync(false, tenantId));

        }
        [HttpPatch]
        [Route("delete-health-procedure/{id}")]
        public async Task<IActionResult> DeleteHealthProcedure(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteHealthProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Health Procedure Identifier must be greater than 0" }
                });
            }

            var result = await _healthProcedureService.UpdateHealthProcedureByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }
        [HttpPost]
        [Route("update-health-procedure/{id}")]
        public async Task<IActionResult> UpdateHealthProcedure(int id, [FromBody] HealthProcedureVm healthProcedureVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateHealthProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Health Procedure Identifier must be greater than 0" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<HealthProcedure>(healthProcedureVm);
                var vHealthProcedure = await _healthProcedureService.GetByIdAsync(id);
                if (vHealthProcedure == null)
                {
                    var res = new UpdateHealthProcedureResponse()
                    {
                        Success = false,
                        Data = new UpdateHealthProcedureData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vHealthProcedure.Kind = model.Kind;
                vHealthProcedure.AnimalTypeId = model.AnimalTypeId;
                vHealthProcedure.ModifiedBy = _userName;
                vHealthProcedure.DateModified = DateTime.Now;
                var result = await _healthProcedureService.UpdateHealthProcedureAsync(vHealthProcedure);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateHealthProcedureResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Health Procedure request." }
            });
        }
        [HttpGet]
        [Route("available-health-procedure")]
        public async Task<IActionResult> GetAvailableHealthProcedures(string healthProcedure, int animaltypeId)
        {
            if (string.IsNullOrEmpty(healthProcedure))
            {
                return BadRequest(new GetAllHealthProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Health Procedure is required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _healthProcedureService.AvailableHealthProcedure(false, healthProcedure, tenantId, animaltypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-health-procedure-by-animalId")]
        public async Task<IActionResult> GetAllActiveHealthProceduresByAnimalId(int animalTypeId)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _healthProcedureService.GetAllHealthProceduresByAnimalIdAsync(false, animalTypeId, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
