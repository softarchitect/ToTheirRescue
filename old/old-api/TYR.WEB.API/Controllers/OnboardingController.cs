using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.Response.AnimalVaccinationResult;
using TYR.WEB.Models.Response.OnboardingResult;
using TYR.WEB.Models.Response.PCOResult;
using TYR.WEB.Models.ViewModels.AnimalBehaviorViewModel;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;
using TYR.WEB.Models.ViewModels.OnboardingViewModel;
using TYR.WEB.Models.ViewModels.PCO;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/onboarding")]
    [ApiController]
    public class OnboardingController : ControllerBase
    {
        private readonly IPCOService _pcoService;
        private readonly IAnimalTypeService _animalTypeService;
        private readonly ISAAnimalTypeService _saAnimalTypeService;
        private readonly ISABehaviorService _saBehaviorService;
        private readonly ISAHealthProcedureService _saHealthProcedureService;
        private readonly ISAVaccinationTypeService _saVaccinationTypeService;
        private readonly IBehaviorService _behaviorService;
        private readonly IHealthProcedureService _healthProcedureService;
        private readonly IVaccinationTypeService _vaccinationTypeService;
        private readonly ITenantService _tenantService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public OnboardingController(IPCOService pCOService, 
                                    IAnimalTypeService animalTypeService, 
                                    IMapper mapper, 
                                    IHttpContextAccessor httpContextAccessor, 
                                    IUserService userService,
                                    ISAAnimalTypeService saAnimalTypeService,
                                    ISABehaviorService sABehaviorService,
                                    ISAHealthProcedureService sAHealthProcedureService,
                                    ISAVaccinationTypeService sAVaccinationTypeService,
                                    IBehaviorService behaviorService,
                                    IHealthProcedureService healthProcedureService,
                                    IVaccinationTypeService vaccinationTypeService,
                                    ITenantService tenantService,
                                    IEmailService emailService)
        {
            _pcoService = pCOService;
            _animalTypeService = animalTypeService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
            _saAnimalTypeService = saAnimalTypeService;
            _saBehaviorService = sABehaviorService;
            _saHealthProcedureService = sAHealthProcedureService;
            _saVaccinationTypeService = sAVaccinationTypeService;
            _behaviorService = behaviorService;
            _healthProcedureService = healthProcedureService;
            _vaccinationTypeService = vaccinationTypeService;
            _tenantService = tenantService;
            _emailService = emailService;
        }

        [HttpPost]
        [Route("add-onboarding")]
        public async Task<IActionResult> AddOnboarding([FromBody] OnboardingVm onboardingVm)
        {
            if (onboardingVm == null)
            {
                return BadRequest(new OnboardingResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal Type(s), Other rescue(s), Clinic(s) / hospital(s) required" }
                });
            }
            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                
                var lstAnimalType = new List<AnimalType>();
                var lstOtherRescues = new List<PCOCustom>();
                var lstHospital = new List<PCOCustom>();
                // Animal Type processing
                foreach(var typeName in onboardingVm.AnimalTypes)
                {
                    var result = await _animalTypeService.AvailableAnimalType(false, typeName, tenantId, UserRoles.Administrator);
                    if (result.Success && result.Data.IsAvailable.Equals(false))
                    {
                        return Ok(result);
                    }
                    else if (result.Success.Equals(false))
                    {
                        return BadRequest(result);
                    }

                    var animalType = new AnimalType();
                    animalType.TypeName = typeName;
                    animalType.TenantId = tenantId;
                    animalType.RoleName = UserRoles.Administrator;
                    animalType.EnteredBy = _userName;
                    animalType.DateEntered = DateTime.Now;

                    var response = await _animalTypeService.AddAnimalTypeAsync(animalType);
                    if (response.Success)
                    {
                        // Get all respective details like their behaviors, their vaccinations, their procedures, etc by Animal Type Name from Super Admin Tables.
                        // We will fill automatically those details into tenant database.
                        var saAnimalTypeResult = await _saAnimalTypeService.GetSAAnimalTypeByAnimalTypeNameAsync(animalType.TypeName);
                        if (saAnimalTypeResult != null)
                        {
                            // Get Super Admin Behaviors by Super Animal Type ID
                            var saBehaviorResult = await _saBehaviorService.GetAllBehaviorsByAnimalTypeIdAsync(false, saAnimalTypeResult.Id);
                            if (saBehaviorResult != null && saBehaviorResult.Success)
                            {
                                foreach (var saBehavior in saBehaviorResult.Data.SABehaviors)
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
                            if (saVaccinationTypeResult != null && saVaccinationTypeResult.Success)
                            {
                                foreach (var saVaccinationType in saVaccinationTypeResult.Data.SAVaccinationTypes)
                                {
                                    var availableVaccinationTypeResult = await _vaccinationTypeService.AvailableVaccinationType(false, saVaccinationType.Kind, tenantId, response.Data.Id);
                                    if (availableVaccinationTypeResult != null && availableVaccinationTypeResult.Success && availableVaccinationTypeResult.Data.IsAvailable)
                                    {
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
                            if (saHealthProcedureResult != null && saHealthProcedureResult.Success)
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

                        //return Ok(response);
                    }
                
                    lstAnimalType.Add(animalType);
                }

                // Other rescue procesing
                foreach(var otherRescue in onboardingVm.OtherRescuePCOs)
                {
                    var pcoVm = new AddPCOVm
                    {
                        FirstName = string.Empty,
                        LastName = otherRescue,
                        Street = string.Empty,
                        Street2 = string.Empty,
                        City = string.Empty,
                        State = string.Empty,
                        Zip = string.Empty,
                        Phone = string.Empty,
                        OtherPhone = string.Empty,
                        Email = string.Empty,
                        Website = string.Empty,
                        Rescue = true,
                        Hospital = false,
                        MailList = true,
                        Notes = string.Empty,
                        EntityType = EntityType.Company_Organisation,
                        Flag = false,
                        FlagReason = string.Empty,
                        CountryId = 0,
                        TenantId = tenantId,
                    };
                    var model = _mapper.Map<PCO>(pcoVm);
                    var tenant = await _tenantService.GetTenantbyIdAsync(tenantId);

                    model.CountryId = pcoVm.CountryId == 0 ? tenant.CountryId : model.CountryId;
                    model.EnteredBy = _userName;
                    model.TenantId = tenantId;
                    model.DateEntered = DateTime.Now;

                    var responseRescuePco = await _pcoService.AddNewPCO(model, tenantId);
                    
                    if(responseRescuePco.Success) lstOtherRescues.Add(responseRescuePco.Data.PCO);
                    else
                    {
                        return BadRequest(new OnboardingResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "Invalid Other Rescue request." },
                            StatusCode = 200
                        });
                    }
                }

                // hospital procesing
                foreach (var hospital in onboardingVm.HospitalPCOs)
                {
                    var pcoVm = new AddPCOVm
                    {
                        FirstName = string.Empty,
                        LastName = hospital,
                        Street = string.Empty,
                        Street2 = string.Empty,
                        City = string.Empty,
                        State = string.Empty,
                        Zip = string.Empty,
                        Phone = string.Empty,
                        OtherPhone = string.Empty,
                        Email = string.Empty,
                        Website = string.Empty,
                        Rescue = false,
                        Hospital = true,
                        MailList = true,
                        Notes = string.Empty,
                        EntityType = EntityType.Company_Organisation,
                        Flag = false,
                        FlagReason = string.Empty,
                        CountryId = 0,
                        TenantId = tenantId,
                    };
                    var model = _mapper.Map<PCO>(pcoVm);
                    var tenant = await _tenantService.GetTenantbyIdAsync(tenantId);

                    model.CountryId = pcoVm.CountryId == 0 ? tenant.CountryId : model.CountryId;
                    model.EnteredBy = _userName;
                    model.TenantId = tenantId;
                    model.DateEntered = DateTime.Now;

                    var responseHospitalPco = await _pcoService.AddNewPCO(model, tenantId);

                    if (responseHospitalPco.Success) lstHospital.Add(responseHospitalPco.Data.PCO);
                    else
                    {
                        return BadRequest(new OnboardingResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "Invalid Hospital request." },
                            StatusCode = 200
                        });
                    }
                }

                return Ok(new OnboardingResponse
                {
                    //Data = new OnboardingData { AnimalTypes = lstAnimalType, Otherrescues = lstOtherRescues, Hospitals = lstHospital },
                    Message = "Onboarding added",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new OnboardingResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid onboarding request."
                    }
            });
        }

        [HttpPost]
        [Route("onboarding-email")]
        public async Task<IActionResult> OnboardingEmail(string firstName, string email)
        {
            try
            {
                if(string.IsNullOrEmpty(firstName))
                {
                    return Ok(new Responses.Response { Success = false, Message = "First name is required" });
                }
                if (string.IsNullOrEmpty(email))
                {
                    return Ok(new Responses.Response { Success = false, Message = "Email is required" });
                }

                var response = await _emailService.OnboardingEmail(firstName, email);
                if(response.IsSuccessStatusCode.Equals(true))
                {
                    return Ok(new Responses.Response { Success = true, Status = "Success", Message = "Onboarding email sent" });
                }
                else
                {
                    return Ok(new Responses.Response { Success = false, Status = "Failed", Message = "Onboarding email has not sent." });
                }
            }
            catch (Exception ex)
            {
                return Ok(new Responses.Response { Success = false, Message = ex.InnerException.ToString() });
            }
        }
    }
}
