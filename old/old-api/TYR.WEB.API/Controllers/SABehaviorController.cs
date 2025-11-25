using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
//using TYR.WEB.Models.Response.BehaviorResult;
//using TYR.WEB.Models.ViewModels.BehaviorViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Models.ViewModels.SABehaviorViewModel;
using TYR.WEB.Models.Response.SABehaviorResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/sabehavior")]
    [ApiController]
    public class SABehaviorController : ControllerBase
    {
        private readonly ISABehaviorService _saBehaviorService;
        private readonly IMapper _mapper;
        //private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        //private readonly IUserService _userService;
        public SABehaviorController(ISABehaviorService saBehaviorService, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _saBehaviorService = saBehaviorService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
        }
        [HttpPost]
        [Route("create-sa-behavior")]
        public async Task<IActionResult> AddSABehavior([FromBody] SABehaviorVm saBehaviorVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SABehavior>(saBehaviorVm);
                //var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _saBehaviorService.AvailableSABehavior(false, model.BehaviorName, saBehaviorVm.SAAnimalTypeId);
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
                var response = await _saBehaviorService.AddSABehaviorAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddSABehaviorResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Behavior request."
                    }
            });
        }

        [HttpGet]
        [Route("get-sa-behaviors")]
        public async Task<IActionResult> GetAllActiveSABehaviors()
        {
            //var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _saBehaviorService.GetAllSABehaviorsAsync(false));

        }

        [HttpPatch]
        [Route("delete-sa-behavior/{id}")]
        public async Task<IActionResult> DeleteSABehavior(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSABehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Behavior Identifier must be greater than 0" }
                });
            }

            var result = await _saBehaviorService.UpdateSABehaviorByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-sa-behavior/{id}")]
        public async Task<IActionResult> UpdateSABehavior(int id, [FromBody] SABehaviorVm saBehaviorVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSABehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Behavior Identifier must be greater than 0" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SABehavior>(saBehaviorVm);
                var vBehavior = await _saBehaviorService.GetByIdAsync(id);
                if (vBehavior == null)
                {
                    var res = new UpdateSABehaviorResponse()
                    {
                        Success = false,
                        Data = new UpdateSABehaviorData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vBehavior.BehaviorName = model.BehaviorName;
                vBehavior.SAAnimalTypeId = model.SAAnimalTypeId;

                var result = await _saBehaviorService.UpdateSABehaviorAsync(vBehavior);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSABehaviorResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid behavior request." }
            });
        }

        [HttpGet]
        [Route("available-sa-behavior")]
        public async Task<IActionResult> GetAvailableSABehavior(string behaviorName, int animalTypeId)
        {
            if (string.IsNullOrEmpty(behaviorName))
            {
                return BadRequest(new GetAvailableSABehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Behavior Name is required."
                    }
                });
            }
            //var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _saBehaviorService.AvailableSABehavior(false, behaviorName, animalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }
        [HttpGet]
        [Route("get-sa-behaviors-by-animaltypeid")]
        public async Task<IActionResult> GetAllActiveBehaviorsByAnimalTypeId(int animalTypeId)
        {
            var result = await _saBehaviorService.GetAllBehaviorsByAnimalTypeIdAsync(false, animalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
