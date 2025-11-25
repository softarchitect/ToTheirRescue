using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using TYR.WEB.Models.Response.AcquisitionWayResult;
using TYR.WEB.Models.ViewModels.AcquisitionWayViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.DataAccess.Entities;
namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/acquisition-way")]
    [ApiController]
    public class AcquisitionWayController : ControllerBase
    {
        private readonly IAcquisitionWayService _animalAcquisitionService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public AcquisitionWayController(IAcquisitionWayService animalAcquisitionService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _animalAcquisitionService = animalAcquisitionService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }
        [HttpPost]
        [Route("create-acquisition-way")]
        public async Task<IActionResult> AddAcquisitionWay([FromBody] AcquisitionWayVm animalAcquisitionVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AcquisitionWay>(animalAcquisitionVm);

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _animalAcquisitionService.AvailableAnimalAcquisition(false, model.AcquisitionWayName, tenantId);
                if (result.Success && result.Data.IsAvailable.Equals(false))
                {
                    return Ok(result);
                }
                else if (result.Success.Equals(false))
                {
                    return BadRequest(result);
                }

                model.EnteredBy = _userName;
                model.IsNotEditable = false;
                model.TenantId = tenantId;
                model.DateEntered = DateTime.Now;
                var response = await _animalAcquisitionService.AddAcquisitionWayAsync(model);
                if (response.Success) return Ok(response);
                return BadRequest(response);
            }

            return BadRequest(new AddAcquisitionWayResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Acquisition Way request."
                    }
            });

        }

        [HttpGet]
        [Route("get-acquisition-way")]
        public async Task<IActionResult> GetAllActiveAcquisitionWays()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _animalAcquisitionService.GetAllAnimalAcquisitionsAsync(false, tenantId));
        }

        [HttpPatch]
        [Route("delete-acquisition-way/{id}")]
        public async Task<IActionResult> DeleteAcquisitionWay(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteAcquisitionWayResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Acquisition Way Identifier must be greater than 0" }
                });
            }

            var result = await _animalAcquisitionService.UpdateAnimalAcquisitionByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-acquisition-way/{id}")]
        public async Task<IActionResult> UpdateAcquisitionWay(int id, [FromBody] AcquisitionWayVm animalAcquisitionVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateAcquisitionWayResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Identifier must be greater than 0" }
                });
            }


            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AcquisitionWay>(animalAcquisitionVm);
                var vAnimalAcquisition = await _animalAcquisitionService.GetByIdAsync(id);
                if (vAnimalAcquisition == null)
                {
                    var res = new UpdateAcquisitionWayResponse()
                    {
                        Success = false,
                        Data = new UpdateAnimalAcquisitionData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vAnimalAcquisition.AcquisitionWayName = model.AcquisitionWayName;
                var result = await _animalAcquisitionService.UpdateAcquisitionWayAsync(vAnimalAcquisition);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateAcquisitionWayResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Acquisition Way request."
                    }
            });
        }

        [HttpGet]
        [Route("available-acquisition-way")]
        public async Task<IActionResult> GetAvailableAcquisitionWay(string acquisition)
        {
            if (string.IsNullOrEmpty(acquisition))
            {
                return BadRequest(new GetAvailableAcquisitionWayResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Acquisition Way is required."
                    }
                });
            }

            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalAcquisitionService.AvailableAnimalAcquisition(false, acquisition, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
