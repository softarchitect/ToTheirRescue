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
using TYR.WEB.Models.ViewModels.MedViewModel;
using TYR.WEB.Models.Response.MedResult;
using TYR.WEB.Models.Response.AnimalTypeResult;
using Microsoft.VisualBasic;
using System.Linq;
using TYR.WEB.Models.Response.AnimalResult;
using TYR.WEB.Models.Response.MedicineResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/med")]
    [ApiController]
    public class MedController : ControllerBase
    {
        private readonly IMedService _medService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public MedController(IMedService medService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _medService = medService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-meds")]
        public async Task<IActionResult> AddMedAsync([FromBody] MedListVm medListVm)
        {
            if (medListVm == null)
            {
                return BadRequest(new AddMedListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Meds required" }

                });
            }
            if (medListVm.MedVms.Count.Equals(0))
            {
                return BadRequest(new AddMedListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Meds required" }
                });
            }

            if (medListVm.AnimalIds.Count == 0)
            {
                return BadRequest(new AddMedListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var lstMedList = new List<AddMedListData>();
                foreach (var id in medListVm.AnimalIds)
                {
                    List<Med> lstMed = new List<Med>();
                    DateTime? dtDate = null;
                    foreach (var medVm in medListVm.MedVms)
                    {
                        if (medVm.DueDate != null && medVm.DueDate.Count > 0)
                        {
                            foreach (var dueDate in medVm.DueDate)
                            {
                                var med = new Med
                                {
                                    AdministeredBy = medVm.AdministeredBy,
                                    AdministeredDate = medVm.AdministeredDate,
                                    DueDate = dueDate,
                                    AnimalId = id,
                                    Clinic = medVm.Clinic,
                                    DateEntered = DateTime.Now,
                                    Dosage = medVm.Dosage,
                                    EnteredBy = _userName,
                                    IsDeleted = false,
                                    MedicineId = medVm.MedicineId,
                                    Notes = medVm.Notes,
                                    PrescriptionRecordNo = medVm.PrescriptionRecordNo,
                                    Reminder = medVm.Reminder,
                                    TenantId = tenantId,
                                    Veterinarian = medVm.Veterinarian
                                };
                                lstMed.Add(med);
                            }
                        }
                        else
                        {
                            var med = new Med
                            {
                                AdministeredBy = medVm.AdministeredBy,
                                AdministeredDate = medVm.AdministeredDate,
                                DueDate = dtDate,
                                AnimalId = id,
                                Clinic = medVm.Clinic,
                                DateEntered = DateTime.Now,
                                Dosage = medVm.Dosage,
                                EnteredBy = _userName,
                                IsDeleted = false,
                                MedicineId = medVm.MedicineId,
                                Notes = medVm.Notes,
                                PrescriptionRecordNo = medVm.PrescriptionRecordNo,
                                Reminder = medVm.Reminder,
                                TenantId = tenantId,
                                Veterinarian = medVm.Veterinarian
                            };
                            lstMed.Add(med);
                        }
                    }

                    var result = await _medService.AddMedAsync(lstMed);
                    if (result.Success)
                    {
                        lstMedList.Add(new AddMedListData { AnimalId = id, Meds = result.Data.Meds });
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }

                return Ok(new AddMedListResponse
                {
                    Data = lstMedList,
                    Message = "Meds added successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new AddMedListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid med request."
                    }
            });
        }

        [HttpGet]
        [Route("get-meds")]
        public async Task<IActionResult> GetMedsByAnimalIdAsync(int animalId, bool reminder)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetMedResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _medService.GetMedByAnimalIdAsync(animalId, false, reminder, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-all-meds")]
        public async Task<IActionResult> GetMedsByTenantIdAsync(bool reminder, int days) // When -999 as days then need to return today's reminders only.
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _medService.GetMedByTenantIdAsync(false, reminder, days, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-med/{id}")]
        public async Task<IActionResult> UpdateMedByIdAsync(int id, [FromBody] MedUpdateVm medVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateMedResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Med Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Med>(medVm);
                var vMed = await _medService.GetMedByIdAsync(id);
                if (vMed == null)
                {
                    var res = new UpdateMedResponse()
                    {
                        Success = false,
                        Data = new UpdateMedData { Id = id, Med = vMed },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                var result = await _medService.UpdateMedAsync(id, model);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateMedResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid med request." }
            });
        }

        [HttpPatch]
        [Route("delete-med/{id}")]
        public async Task<IActionResult> DeleteMedByIdAsync(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteMedResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Med identifier must be greater than 0" }
                });
            }

            var result = await _medService.UpdateMedByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPut]
        [Route("update-meds-given")]
        public async Task<IActionResult> UpdateMedsGivenByIds([System.Web.Http.FromUri] string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest(new UpdateMedGivenListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" },
                    StatusCode = 400
                });
            }

            if (ModelState.IsValid)
            {
                var sIdents = ids.Split(',').ToList();
                var idents = new List<int>();
                foreach (string s in sIdents)
                {
                    idents.Add(int.Parse(s));
                }

                var result = await _medService.UpdateMedGivenListAsync(idents);
                return Ok(result);
            }
            else
            {
                return BadRequest(new UpdateMedGivenListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Invalid request." }
                });
            }
        }

        [HttpPut]
        [Route("update-med-completed")]
        public async Task<IActionResult> UpdateMedCompletedById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateMedCompletedResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" },
                    StatusCode = 400
                });
            }

            if (ModelState.IsValid)
            {
                var result = await _medService.UpdateMedCompletedByIdAsync(id);
                return Ok(result);
            }
            else
            {
                return BadRequest(new UpdateMedCompletedResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Invalid request." }
                });
            }
        }
    }
}
