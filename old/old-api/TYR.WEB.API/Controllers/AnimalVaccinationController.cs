using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;
using TYR.WEB.Models.Response.AnimalVaccinationResult;
using TYR.WEB.Models.Response.AnimalBehaviorResult;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using Org.BouncyCastle.Crypto;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/animal-vaccination")]
    [ApiController]
    public class AnimalVaccinationController : ControllerBase
    {
        private readonly IAnimalVaccinationService _animalVaccinationService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public AnimalVaccinationController(IAnimalVaccinationService animalVaccinationService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _animalVaccinationService = animalVaccinationService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-animal-vaccinations")]
        public async Task<IActionResult> AddAnimalVaccination([FromBody] AnimalVaccinationListVm animalVaccinationListVm)
        {
            if (animalVaccinationListVm == null)
            {
                return BadRequest(new AddAnimalVaccinationListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccinations required" }

                });
            }
            if (animalVaccinationListVm.AnimalVaccinationVm.Count.Equals(0))
            {
                return BadRequest(new AddAnimalVaccinationListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccinations required" }
                });
            }

            if (animalVaccinationListVm.AnimalIds.Count == 0)
            {
                return BadRequest(new AddAnimalVaccinationListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var lstAnimalVaccinationList = new List<AnimalVaccinationListData>();
                
                foreach (var id in animalVaccinationListVm.AnimalIds)
                {
                    List<AnimalVaccination> lstAnimalVaccination = new List<AnimalVaccination>();
                    // VAC${moment().format('DDYYHHmmssSSS')}
                    // VAC12205072024 = VAC + AnimalID - TenantID + MMDDYYYY Seconds Millisceonds
                    string vaccRecordNo = "VAC" + id + tenantId + DateTime.Now.Month + DateTime.Now.Day + DateTime.Now.Year + DateTime.Now.Second + DateTime.Now.Millisecond;
                    DateTime? dtDate = null;
                    foreach (var vaccinationVm in animalVaccinationListVm.AnimalVaccinationVm)
                    {
                        if(vaccinationVm.DueDate != null && vaccinationVm.DueDate.Count > 0)
                        {
                            foreach (var dueDate in vaccinationVm.DueDate)
                            {
                                var animalVaccination = new AnimalVaccination { 
                                    ActionDate = vaccinationVm.ActionDate,
                                    Administerer = vaccinationVm.Administerer,
                                    AnimalId = id,
                                    DueDate = dueDate,
                                    DateEntered = DateTime.Now,
                                    DateModified = DateTime.Now,
                                    DueAgain = vaccinationVm.DueAgain,
                                    EnteredBy = _userName,
                                    HospitalClinicId = vaccinationVm.HospitalClinicId,
                                    IsDeleted = false,
                                    KindId = vaccinationVm.KindId,
                                    ModifiedBy = _userName,
                                    Notes = vaccinationVm.Notes,
                                    Reminder = vaccinationVm.Reminder,
                                    TagNumber = vaccinationVm.TagNumber,
                                    TenantId = tenantId,
                                    //VaccineExpirationDate = vaccinationVm?.VaccineExpirationDate,
                                    VaccineManufacturer = vaccinationVm?.VaccineManufacturer,
                                    VaccineSerialNo = vaccinationVm.VaccineSerialNo,
                                    VaccRecordNo = string.IsNullOrEmpty(vaccinationVm.DueAgain) ? "0" : vaccRecordNo
                                };
                                lstAnimalVaccination.Add(animalVaccination);
                            }
                        }
                        else
                        {
                            var animalVaccination = new AnimalVaccination
                            {
                                ActionDate = vaccinationVm.ActionDate,
                                Administerer = vaccinationVm.Administerer,
                                AnimalId = id,
                                DueDate = dtDate,
                                DateEntered = DateTime.Now,
                                DateModified = DateTime.Now,
                                DueAgain = vaccinationVm.DueAgain,
                                EnteredBy = _userName,
                                HospitalClinicId = vaccinationVm.HospitalClinicId,
                                IsDeleted = false,
                                KindId = vaccinationVm.KindId,
                                ModifiedBy = _userName,
                                Notes = vaccinationVm.Notes,
                                Reminder = vaccinationVm.Reminder,
                                TagNumber = vaccinationVm.TagNumber,
                                TenantId = tenantId,
                                //VaccineExpirationDate = vaccinationVm?.VaccineExpirationDate,
                                VaccineManufacturer = vaccinationVm?.VaccineManufacturer,
                                VaccineSerialNo = vaccinationVm.VaccineSerialNo,
                                VaccRecordNo = string.IsNullOrEmpty(vaccinationVm.DueAgain) ? "0" : vaccRecordNo
                            };
                            lstAnimalVaccination.Add(animalVaccination);
                        }
                        
                    }


                    //var listModel = _mapper.Map<List<AnimalVaccination>>(animalVaccinationListVm.AnimalVaccinationVm);



                    //foreach (var model in listModel)
                    //{
                    //    //var sIdents = ids.Split(',').ToList();
                    //    //var idents = new List<int>();
                    //    //foreach (string s in sIdents)
                    //    //{
                    //    //    idents.Add(int.Parse(s));
                    //    //}
                    //    //foreach(var dueDateVaccination in model.Du)
                    //    model.AnimalId = id;
                    //    model.DateEntered = DateTime.Now;
                    //    model.IsDeleted = false;
                    //    model.EnteredBy = _userName;
                    //    model.TenantId = tenantId;
                    //    model.VaccRecordNo = vaccRecordNo;

                    //    // If there is no vaccination record and user wants reminder then VaccRecordNo = 0
                    //    //if(model.Reminder.Equals(false)) model.VaccRecordNo = "0";
                    //    //if(string.IsNullOrEmpty(model.VaccRecordNo)) model.VaccRecordNo = "0";
                    //}

                    //var result = await _animalVaccinationService.AddAnimalVaccinationAsync(listModel);
                    var result = await _animalVaccinationService.AddAnimalVaccinationAsync(lstAnimalVaccination);
                    if (result.Success)
                    {
                        lstAnimalVaccinationList.Add(new AnimalVaccinationListData { AnimalId = id, AnimalVaccinations = result.Data.AnimalVaccinations });
                    }
                    else
                    {
                        return BadRequest(result);
                    }

                }

                return Ok(new AddAnimalVaccinationListResponse
                {
                    Data = lstAnimalVaccinationList,
                    Message = "Vaccination added successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new AddAnimalProcedureListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid vaccination request."
                    }
            });
        }

        [HttpGet]
        [Route("get-animal-vaccination")]
        public async Task<IActionResult> GetAnimalVaccinationByAnimalId(int animalId, bool reminder)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetAnimalVaccinationResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalVaccinationService.GetAnimalVaccinationByAnimalIdAsync(animalId, false, reminder, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-animal-vaccination/{id}")]
        public async Task<IActionResult> UpdateAnimalVaccinationById(int id, int completeReminder, [FromBody] AnimalVaccinationUpdateVm animalVaccinationVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateAnimalVaccinationResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AnimalVaccination>(animalVaccinationVm);
                var vAnimalVaccination = await _animalVaccinationService.GetAnimalVaccinationByIdAsync(id);
                if (vAnimalVaccination == null)
                {
                    var res = new UpdateAnimalVaccinationResponse()
                    {
                        Success = false,
                        Data = new UpdateAnimalVaccinationData { Id = id, AnimalVaccination = vAnimalVaccination },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }
                // DueAgain = BLANK in database mistakenly then check model.DueAgain = NotBlank then reminder should be true
                if(string.IsNullOrEmpty(vAnimalVaccination.DueAgain) && !string.IsNullOrEmpty(model.DueAgain)) { model.Reminder = true; }

                var result = await _animalVaccinationService.UpdateAnimalVaccinationAsync(model, id);
                if (result.Success && completeReminder.Equals(1)) 
                {
                    // Completed Reminder and if completed and needs to create new reminder then need to create new record with reminder.
                    // {kindId, dueAgain, dueDate, reminder:true}
                    var vaccination = new AnimalVaccination
                    {
                        KindId = model.KindId,
                        DueAgain = model.DueAgain,
                        DueDate = model.DueDate,
                        Reminder = true,
                        VaccRecordNo = vAnimalVaccination.VaccRecordNo,
                        AnimalId = vAnimalVaccination.AnimalId,
                        DateEntered = DateTime.Now,
                        IsDeleted = false,
                        EnteredBy = _userName,
                        TenantId = vAnimalVaccination.TenantId
                    };
                    var lstAnimalVaccinations = new List<AnimalVaccination>
                    {
                        vaccination
                    };
                    var addResult = await _animalVaccinationService.AddAnimalVaccinationAsync(lstAnimalVaccinations);
                    if(addResult.Success) { bool res = addResult.Success; }
                }
                
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateAnimalVaccinationResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid vaccination request." }
            });
        }

        [HttpPatch]
        [Route("delete-animal-vaccination/{id}")]
        public async Task<IActionResult> DeleteAnimalVaccinationById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteAnimalVaccinationResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination identifier must be greater than 0" }
                });
            }

            var result = await _animalVaccinationService.UpdateAnimalVaccinationByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-all-animal-vaccinations")]
        public async Task<IActionResult> GetAllAnimalVaccinations(bool reminder, int days)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalVaccinationService.GetAllAnimalVaccinationsAsync(false, reminder, days, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("check-animal-vaccination-reminder-exist")]
        public async Task<IActionResult> CheckAnimalVaccinationRemindersExist(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new CheckAnimalVaccinationReminderResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Vaccination identifier must be greater than 0" }
                });
            }

            var result = await _animalVaccinationService.CheckAnimalVaccinationRemindersExistAsync(id);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }
    }
}
