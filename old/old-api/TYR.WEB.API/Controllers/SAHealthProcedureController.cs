using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthProcedureResult;
using TYR.WEB.Models.ViewModels.HealthProcedureViewModel;
using TYR.WEB.Models.ViewModels.SAHealthProcedureViewModel;
using TYR.WEB.Models.Response.SAHealthProcedureResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/sahealth-procedure")]
    [ApiController]
    public class SAHealthProcedureController : ControllerBase
    {
        private readonly ISAHealthProcedureService _saHealthProcedureService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public SAHealthProcedureController(ISAHealthProcedureService saHealthProcedureService, 
                                           IHttpContextAccessor httpContextAccessor, 
                                           IMapper mapper, 
                                           IUserService userService)
        {
            _saHealthProcedureService = saHealthProcedureService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _userService = userService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        [HttpPost]
        [Route("create-sa-health-procedure")]
        public async Task<IActionResult> AddSAHealthProcedure([FromBody] SAHealthProcedureVm saHealthProcedureVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAHealthProcedure>(saHealthProcedureVm);
                var result = await _saHealthProcedureService.AvailableSAHealthProcedure(false, model.Kind, saHealthProcedureVm.SAAnimalTypeId);
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
                var response = await _saHealthProcedureService.AddSAHealthProcedureAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddSAHealthProcedureResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Health Procedure request."
                    }
            });
        }

        [HttpGet]
        [Route("get-sa-health-procedures")]
        public async Task<IActionResult> GetAllActiveSAHealthProcedures()
        {
            return Ok(await _saHealthProcedureService.GetAllSAHealthProcedurersAsync(false));

        }

        [HttpPatch]
        [Route("delete-sa-health-procedure/{id}")]
        public async Task<IActionResult> DeleteSAHealthProcedure(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSAHealthProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Health Procedure Identifier must be greater than 0" }
                });
            }

            var result = await _saHealthProcedureService.UpdateSAHealthProcedureByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-sa-health-procedure/{id}")]
        public async Task<IActionResult> UpdateSAHealthProcedure(int id, [FromBody] SAHealthProcedureVm saHealthProcedureVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSAHealthProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Health Procedure Identifier must be greater than 0" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAHealthProcedure>(saHealthProcedureVm);
                var vSAHealthProcedure = await _saHealthProcedureService.GetByIdAsync(id);
                if (vSAHealthProcedure == null)
                {
                    var res = new UpdateSAHealthProcedureResponse()
                    {
                        Success = false,
                        Data = new UpdateSAHealthProcedureData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vSAHealthProcedure.Kind = model.Kind;
                vSAHealthProcedure.SAAnimalTypeId = model.SAAnimalTypeId;
                vSAHealthProcedure.ModifiedBy = _userName;
                vSAHealthProcedure.DateModified = DateTime.Now;
                var result = await _saHealthProcedureService.UpdateSAHealthProcedureAsync(vSAHealthProcedure);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSAHealthProcedureResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Health Procedure request." }
            });
        }

        [HttpGet]
        [Route("available-sa-health-procedure")]
        public async Task<IActionResult> GetAvailableSAHealthProcedures(string saHealthProcedure, int saAnimalTypeId)
        {
            if (string.IsNullOrEmpty(saHealthProcedure))
            {
                return BadRequest(new GetAllSAHealthProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Health Procedure is required."
                    }
                });
            }
            
            var result = await _saHealthProcedureService.AvailableSAHealthProcedure(false, saHealthProcedure, saAnimalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-sa-health-procedure-by-animaltypeId")]
        public async Task<IActionResult> GetAllActiveHealthProceduresByAnimalId(int saAnimalTypeId)
        {
            var result = await _saHealthProcedureService.GetAllSAHealthProceduresByAnimalIdAsync(false, saAnimalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

    }
}
