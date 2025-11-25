using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalMilestoneResult;
using TYR.WEB.Models.ViewModels.AnimalBehaviorViewModel;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.Response.AnimalBehaviorResult;
using System.Web.Http.Results;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Models.ViewModels.BehaviorViewModel;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/animal-behavior")]
    [ApiController]
    public class AnimalBehaviorController : ControllerBase
    {
        private readonly IAnimalBehaviorService _animalBehaviorService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public AnimalBehaviorController(IAnimalBehaviorService animalBehaviorService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _animalBehaviorService = animalBehaviorService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _userService = userService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        [HttpPost]
        [Route("upsert-animal-behaviors")]
        public async Task<IActionResult> UpsertAnimalBehaviors([FromBody] AnimalBehaviorListVm animalBehaviorListVm)
        {
            if (animalBehaviorListVm == null)
            {
                return BadRequest(new AddAnimalBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal behaviors required" }

                });
            }
            
            if (animalBehaviorListVm.AnimalBehaviorVms.Count == 0)
            {
                return BadRequest(new AddAnimalBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal behaviors required" }
                });
            }
            
            if (animalBehaviorListVm.AnimalIds.Count == 0)
            {
                return BadRequest(new AddAnimalBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var lstAnimalBehaviorList = new List<AnimalBehaviorListData>();
                foreach (var id in animalBehaviorListVm.AnimalIds)
                {
                    var listModel = _mapper.Map<List<AnimalBehavior>>(animalBehaviorListVm.AnimalBehaviorVms);
                    // AnimalId
                    // BehaviorId
                    // YesOrNo
                    // Notes

                    foreach (var model in listModel)
                    {
                        model.AnimalId = id;
                        model.DateEntered = DateTime.Now;
                        model.IsDeleted = false;
                        model.EnteredBy = _userName;
                        model.TenantId = tenantId;
                        model.DateModified = DateTime.Now;
                        model.ModifiedBy = _userName;
                    }

                    var result = await _animalBehaviorService.UpsertAnimalBehaviorAsync(listModel);
                    if (result.Success)
                    {
                        lstAnimalBehaviorList.Add(new AnimalBehaviorListData { AnimalId = id, AnimalBehaviors = result.Data.AnimalBehaviors });
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }

                return Ok(new AnimalBehaviorListResponse
                {
                    Data = lstAnimalBehaviorList,
                    Message = "Animal behaviors added successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new AddAnimalBehaviorResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Animal behavior request."
                    }
            });
        }

        [HttpGet]
        [Route("get-animal-behaviors")]
        public async Task<IActionResult> GetAllActiveAnimalBehaviors(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetAllAnimalBehaviorsResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalBehaviorService.GetAllAnimalBehaviorsAsync(animalId, false, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-animal-behaviors/{animalid}")]
        public async Task<IActionResult> UpdateAnimalBehaviors(int animalId, [FromBody] AnimalBehaviorListVm animalBehaviorListVm)
        {
            if (animalId <= 0)
            {
                return BadRequest(new UpdateAnimalBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal Identifier must be greater than 0" }
                });
            }

            if (animalBehaviorListVm == null)
            {
                return BadRequest(new UpdateAnimalBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal behaviors required" }

                });
            }
            if (animalBehaviorListVm.AnimalBehaviorVms.Count == 0)
            {
                return BadRequest(new UpdateAnimalBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal behaviors required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var resultBehaviors = await _animalBehaviorService.GetAllAnimalBehaviorsAsync(animalId, false, tenantId);

                //if
                var listModel = _mapper.Map<List<AnimalBehavior>>(animalBehaviorListVm.AnimalBehaviorVms);
                foreach (var model in listModel)
                {
                    model.DateModified = DateTime.Now;
                    model.ModifiedBy = _userName;
                }

                var result = await _animalBehaviorService.UpdateAnimalBehaviorAsync(listModel);
                if (result.Success) return Ok(result);
                else
                {
                    return BadRequest(result);
                }
            }

            return BadRequest(new UpdateAnimalBehaviorResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid behavior request." }
            });
        }

    }
}
