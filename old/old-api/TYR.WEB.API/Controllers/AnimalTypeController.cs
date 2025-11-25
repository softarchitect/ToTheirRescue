using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.ViewModels.AnimalTypeViewModel;
using TYR.WEB.Models.ViewModels.SABehaviorViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/animaltype")]
    [ApiController]
    public class AnimalTypeController : ControllerBase
    {
        private readonly IAnimalTypeService _animalTypeService;
        private readonly ISAAnimalTypeService _saAnimalTypeService;
        private readonly ISABehaviorService _saBehaviorService;
        private readonly ISAHealthProcedureService _saHealthProcedureService;
        private readonly ISAVaccinationTypeService _saVaccinationTypeService;
        private readonly IBehaviorService _behaviorService;
        private readonly IHealthProcedureService _healthProcedureService;
        private readonly IVaccinationTypeService _vaccinationTypeService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public AnimalTypeController(IAnimalTypeService animalTypeService, 
            IHttpContextAccessor httpContextAccessor, 
            IMapper mapper, 
            IUserService userService, 
            ISAAnimalTypeService saAnimalTypeService, 
            ISABehaviorService sABehaviorService,
            ISAHealthProcedureService sAHealthProcedureService,
            ISAVaccinationTypeService sAVaccinationTypeService,
            IBehaviorService behaviorService,
            IHealthProcedureService healthProcedureService,
            IVaccinationTypeService vaccinationTypeService)
        {
            _animalTypeService = animalTypeService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
            _saAnimalTypeService = saAnimalTypeService;
            _saBehaviorService = sABehaviorService;
            _saHealthProcedureService = sAHealthProcedureService;
            _saVaccinationTypeService = sAVaccinationTypeService;
            _behaviorService = behaviorService;
            _healthProcedureService = healthProcedureService;
            _vaccinationTypeService = vaccinationTypeService;
        }

        [HttpPost]
        [Route("create-animal-type")]
        public async Task<IActionResult> AddAnimalType([FromBody] AnimalTypeVm animalTypeVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AnimalType>(animalTypeVm);

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                //tenantId = animalTypeVm.RoleName.ToLower().Equals(UserRoles.SuperAdministrator.ToLower()) ? 0 : tenantId;
                var result = await _animalTypeService.AvailableAnimalType(false, model.TypeName, tenantId, model.RoleName);
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
                var response = await _animalTypeService.AddAnimalTypeAsync(model);
                if (response.Success)
                {
                    // Get all respective details like their behaviors, their vaccinations, their procedures, etc by Animal Type Name from Super Admin Tables.
                    // We will fill automatically those details into tenant database.
                    var saAnimalTypeResult = await _saAnimalTypeService.GetSAAnimalTypeByAnimalTypeNameAsync(model.TypeName);
                    if(saAnimalTypeResult != null)
                    {
                        // Get Super Admin Behaviors by Super Animal Type ID
                        var saBehaviorResult = await _saBehaviorService.GetAllBehaviorsByAnimalTypeIdAsync(false, saAnimalTypeResult.Id);
                        if (saBehaviorResult != null && saBehaviorResult.Success) { 
                            foreach(var saBehavior in saBehaviorResult.Data.SABehaviors)
                            {
                                var availableResult = await _behaviorService.AvailableBehavior(false, saBehavior.BehaviorName, tenantId, response.Data.Id);
                                if (availableResult != null && availableResult.Success && availableResult.Data.IsAvailable)
                                {
                                    var behavior = new Behavior()
                                    {
                                        AnimalTypeId = response.Data.Id,
                                        BehaviorName = saBehavior.BehaviorName,
                                        IsDeleted = false,
                                        TenantId = tenantId,
                                        DateEntered = DateTime.Now,
                                        EnteredBy = _userName
                                    };
                                    await _behaviorService.AddBehaviorAsync(behavior);
                                }
                            }
                        }

                        // Get Super Admin Vaccinations by Super Animal Type ID
                        var saVaccinationTypeResult = await _saVaccinationTypeService.GetAllSAVaccinationTypesByAnimalIdAsync(false, saAnimalTypeResult.Id);
                        if(saVaccinationTypeResult != null && saVaccinationTypeResult.Success)
                        {
                            foreach(var saVaccinationType in saVaccinationTypeResult.Data.SAVaccinationTypes)
                            {
                                var availableVaccinationTypeResult = await _vaccinationTypeService.AvailableVaccinationType(false, saVaccinationType.Kind, tenantId, response.Data.Id);
                                if (availableVaccinationTypeResult != null && availableVaccinationTypeResult.Success && availableVaccinationTypeResult.Data.IsAvailable) {
                                    var vaccinationType = new VaccinationType()
                                    {
                                        AnimalTypeId = response.Data.Id,
                                        DateEntered = DateTime.Now,
                                        EnteredBy = _userName,
                                        IsDeleted = false,
                                        TenantId = tenantId,
                                        Kind = saVaccinationType.Kind,
                                        DateModified = DateTime.Now,
                                        ModifiedBy = _userName
                                    };
                                    await _vaccinationTypeService.AddVaccinationTypeAsync(vaccinationType);
                                }
                            }
                        }

                        // Get Super Admin Procedures by Super Animal Type ID
                        var saHealthProcedureResult = await _saHealthProcedureService.GetAllSAHealthProceduresByAnimalIdAsync(false, saAnimalTypeResult.Id);
                        if(saHealthProcedureResult != null && saHealthProcedureResult.Success)
                        {
                            foreach (var saHealthProcedure in saHealthProcedureResult.Data.SAHealthProcedures)
                            {
                                var availableHealthProcedureResult = await _healthProcedureService.AvailableHealthProcedure(false, saHealthProcedure.Kind, tenantId, response.Data.Id);
                                if (availableHealthProcedureResult != null && availableHealthProcedureResult.Success && availableHealthProcedureResult.Data.IsAvailable)
                                {
                                    var healthProcedure = new HealthProcedure()
                                    {
                                        AnimalTypeId = response.Data.Id,
                                        DateEntered = DateTime.Now,
                                        EnteredBy = _userName,
                                        IsDeleted = false,
                                        TenantId = tenantId,
                                        Kind = saHealthProcedure.Kind,
                                        DateModified = DateTime.Now,
                                        ModifiedBy = _userName
                                    };
                                    await _healthProcedureService.AddHealthProcedureAsync(healthProcedure);
                                }
                            }  
                        }
                    }

                    return Ok(response);
                }
                
                return BadRequest(response);
            }

            return BadRequest(new AddAnimalTypeResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid animal type request."
                    }
            });
        }

        [HttpGet]
        [Route("get-animal-types")]
        public async Task<IActionResult> GetAllActiveAnimalTypes(string roleName)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _animalTypeService.GetAllAnimalTypesAsync(false, tenantId, roleName));
        }

        [HttpPatch]
        [Route("delete-animal-type/{id}")]
        public async Task<IActionResult> DeleteAnimalType(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteAnimalTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal Identifier must be greater than 0" }
                });
            }

            var result = await _animalTypeService.UpdateAnimalTypeByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-animal-type/{id}")]
        public async Task<IActionResult> UpdateAnimalType(int id, [FromBody] AnimalTypeVm animalTypeVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateAnimalTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AnimalType>(animalTypeVm);
                var vAnimalType = await _animalTypeService.GetByIdAsync(id);
                if (vAnimalType == null)
                {
                    var res = new UpdateAnimalTypeResponse()
                    {
                        Success = false,
                        Data = new UpdateAnimalTypeData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vAnimalType.TypeName = model.TypeName;
                var result = await _animalTypeService.UpdateAnimalTypeAsync(vAnimalType);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateAnimalTypeResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid animal type request." }
            });
        }

        [HttpGet]
        [Route("available-animal-type")]
        public async Task<IActionResult> GetAvailableAnimalType(string typeName, string roleName)
        {
            if (string.IsNullOrEmpty(typeName))
            {
                return BadRequest(new GetAvailableAnimalTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal Type Name is required." }
                });
            }
            if(string.IsNullOrEmpty(roleName))
            {
                return BadRequest(new GetAvailableAnimalTypeResponse
                { 
                    Success = false,
                    Errors = new List<string>() { "Role Name is required." }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalTypeService.AvailableAnimalType(false, typeName, tenantId, roleName);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
