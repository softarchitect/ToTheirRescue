using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VaccinationTypeResult;
using TYR.WEB.Models.ViewModels.VaccinationTypeViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/vaccination-type")]
    [ApiController]
    public class VaccinationTypeController : ControllerBase
    {
        private readonly IVaccinationTypeService _vaccinationTypeService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public VaccinationTypeController(IVaccinationTypeService vaccinationTypeService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _vaccinationTypeService = vaccinationTypeService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost]
        [Route("create-vaccination-type")]
        public async Task<IActionResult> AddVaccinationType([FromBody] VaccinationTypeVm vaccinationTypeVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<VaccinationType>(vaccinationTypeVm);
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _vaccinationTypeService.AvailableVaccinationType(false, model.Kind, tenantId, vaccinationTypeVm.AnimalTypeId);
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
                var response = await _vaccinationTypeService.AddVaccinationTypeAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddVaccinationTypeResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Vaccination Type request."
                    }
            });
        }

        [HttpGet]
        [Route("get-vaccination-type")]
        public async Task<IActionResult> GetAllActiveVaccinationTypes()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _vaccinationTypeService.GetAllVaccinationTypesAsync(false, tenantId));

        }

        [HttpPatch]
        [Route("delete-vaccination-type/{id}")]
        public async Task<IActionResult> DeleteVaccinationType(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteVaccinationTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination Type Identifier must be greater than 0" }
                });
            }

            var result = await _vaccinationTypeService.UpdateVaccinationTypeByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-vaccination-type/{id}")]
        public async Task<IActionResult> UpdateVaccinationType(int id, [FromBody] VaccinationTypeVm vaccinationTypeVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateVaccinationTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination Type Identifier must be greater than 0" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<VaccinationType>(vaccinationTypeVm);
                var vVaccinationType = await _vaccinationTypeService.GetByIdAsync(id);
                if (vVaccinationType == null)
                {
                    var res = new UpdateVaccinationTypeResponse()
                    {
                        Success = false,
                        Data = new UpdateVaccinationTypeData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vVaccinationType.Kind = model.Kind;
                vVaccinationType.AnimalTypeId = model.AnimalTypeId;
                vVaccinationType.ModifiedBy = _userName;
                vVaccinationType.DateModified = DateTime.Now;
                var result = await _vaccinationTypeService.UpdateVaccinationTypeAsync(vVaccinationType);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateVaccinationTypeResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Vaccination Type request." }
            });
        }

        [HttpGet]
        [Route("available-vaccination-type")]
        public async Task<IActionResult> GetAvailableVaccinationTypes(string vaccinationType, int animaltypeId)
        {
            if (string.IsNullOrEmpty(vaccinationType))
            {
                return BadRequest(new GetAvailableVaccinationTypesResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Vaccination Type is required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _vaccinationTypeService.AvailableVaccinationType(false, vaccinationType, tenantId, animaltypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-vaccination-type-by-animalId")]
        public async Task<IActionResult> GetAllActiveVaccinationTypesByAnimalId(int animalTypeId)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _vaccinationTypeService.GetAllVaccinationTypesByAnimalIdAsync(false, animalTypeId, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
