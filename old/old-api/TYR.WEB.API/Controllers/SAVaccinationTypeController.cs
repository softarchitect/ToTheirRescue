using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.SAVaccinationTypeViewModel;
using TYR.WEB.Models.Response.SAVaccinationTypeResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/savaccination-type")]
    [ApiController]
    public class SAVaccinationTypeController : ControllerBase
    {
        private readonly ISAVaccinationTypeService _saVaccinationTypeService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        public SAVaccinationTypeController(ISAVaccinationTypeService saVaccinationTypeService, IHttpContextAccessor httpContextAccessor, IMapper mapper) 
        {
            _saVaccinationTypeService = saVaccinationTypeService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create-sa-vaccination-type")]
        public async Task<IActionResult> AddSAVaccinationType([FromBody] SAVaccinationTypeVm saVaccinationTypeVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAVaccinationType>(saVaccinationTypeVm);
                var result = await _saVaccinationTypeService.AvailableSAVaccinationType(false, model.Kind, saVaccinationTypeVm.SAAnimalTypeId);
                if (result.Success && result.Data.IsAvailable.Equals(false))
                {
                    return Ok(result);
                }
                else if (result.Success.Equals(false))
                {
                    return BadRequest(result);
                }

                model.EnteredBy = _userName;
                model.DateEntered = DateTime.Now;
                var response = await _saVaccinationTypeService.AddSAVaccinationTypeAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddSAVaccinationTypeResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Vaccination Type request."
                    }
            });
        }

        [HttpGet]
        [Route("get-sa-vaccination-type")]
        public async Task<IActionResult> GetAllActiveSAVaccinationTypes()
        {
            return Ok(await _saVaccinationTypeService.GetAllSAVaccinationTypesAsync(false));

        }

        [HttpPatch]
        [Route("delete-sa-vaccination-type/{id}")]
        public async Task<IActionResult> DeleteSAVaccinationType(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSAVaccinationTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination Type Identifier must be greater than 0" }
                });
            }

            var result = await _saVaccinationTypeService.UpdateSAVaccinationTypeByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-sa-vaccination-type/{id}")]
        public async Task<IActionResult> UpdateSAVaccinationType(int id, [FromBody] SAVaccinationTypeVm saVaccinationTypeVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSAVaccinationTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination Type Identifier must be greater than 0" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAVaccinationType>(saVaccinationTypeVm);
                var vSAVaccinationType = await _saVaccinationTypeService.GetByIdAsync(id);
                if (vSAVaccinationType == null)
                {
                    var res = new UpdateSAVaccinationTypeResponse()
                    {
                        Success = false,
                        Data = new UpdateSAVaccinationTypeData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vSAVaccinationType.Kind = model.Kind;
                vSAVaccinationType.SAAnimalTypeId = model.SAAnimalTypeId;
                vSAVaccinationType.ModifiedBy = _userName;
                vSAVaccinationType.DateModified = DateTime.Now;
                var result = await _saVaccinationTypeService.UpdateSAVaccinationTypeAsync(vSAVaccinationType);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSAVaccinationTypeResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Vaccination Type request." }
            });
        }

        [HttpGet]
        [Route("available-sa-vaccination-type")]
        public async Task<IActionResult> GetAvailableSAVaccinationTypes(string saVaccinationType, int saAnimalTypeId)
        {
            if (string.IsNullOrEmpty(saVaccinationType))
            {
                return BadRequest(new GetAvailableSAVaccinationTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Vaccination Type is required."
                    }
                });
            }
            
            var result = await _saVaccinationTypeService.AvailableSAVaccinationType(false, saVaccinationType, saAnimalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-sa-vaccination-type-by-animaltypeId")]
        public async Task<IActionResult> GetAllActiveSAVaccinationTypesByAnimalTypeId(int saAnimalTypeId)
        {
            var result = await _saVaccinationTypeService.GetAllSAVaccinationTypesByAnimalIdAsync(false, saAnimalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
