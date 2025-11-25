using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Models.ViewModels.BehaviorViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/behavior")]
    [ApiController]
    public class BehaviorController : ControllerBase
    {
        private readonly IBehaviorService _behaviorService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public BehaviorController(IBehaviorService behaviorService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _behaviorService = behaviorService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }
        [HttpPost]
        [Route("create-behavior")]
        public async Task<IActionResult> AddBehavior([FromBody] BehaviorVm behaviorVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Behavior>(behaviorVm);
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _behaviorService.AvailableBehavior(false, model.BehaviorName, tenantId, behaviorVm.AnimalTypeId);
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
                var response = await _behaviorService.AddBehaviorAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddBehaviorResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Behavior request."
                    }
            });

        }

        [HttpGet]
        [Route("get-behaviors")]
        public async Task<IActionResult> GetAllActiveBehaviors()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _behaviorService.GetAllBehaviorsAsync(false, tenantId));
            
        }

        [HttpPatch]
        [Route("delete-behavior/{id}")]
        public async Task<IActionResult> DeleteBehavior(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Behavior Identifier must be greater than 0" }
                });
            }

            var result = await _behaviorService.UpdateBehaviorByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);

        }

        [HttpPost]
        [Route("update-behavior/{id}")]
        public async Task<IActionResult> UpdateBehavior(int id, [FromBody] BehaviorVm behaviorVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Behavior Identifier must be greater than 0" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Behavior>(behaviorVm);
                var vBehavior = await _behaviorService.GetByIdAsync(id);
                if (vBehavior == null)
                {
                    var res = new UpdateBehaviorResponse()
                    {
                        Success = false,
                        Data = new UpdateBehaviorData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vBehavior.BehaviorName = model.BehaviorName;
                vBehavior.AnimalTypeId = model.AnimalTypeId;
                vBehavior.ModifiedBy = _userName;
                vBehavior.DateModified = DateTime.Now;

                var result = await _behaviorService.UpdateBehaviorAsync(vBehavior);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateBehaviorResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid behavior request." }
            });
        }

        [HttpGet]
        [Route("available-behavior")]
        public async Task<IActionResult> GetAvailableBehavior(string behaviorName, int animaltypeId)
        {
            if (string.IsNullOrEmpty(behaviorName))
            {
                return BadRequest(new GetAvailableBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Behavior Name is required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _behaviorService.AvailableBehavior(false, behaviorName, tenantId, animaltypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }
        [HttpGet]
        [Route("get-behaviors-by-animalId")]
        public async Task<IActionResult> GetAllActiveBehaviorsByAnimalTypeId(int animalTypeId)
        {
            var result = await _behaviorService.GetAllBehaviorsByAnimalTypeIdAsync(false, animalTypeId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
