using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/animal-procedure")]
    [ApiController]
    public class AnimalProcedureController : ControllerBase
    {
        private readonly IAnimalProcedureService _animalProcedureService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public AnimalProcedureController(IAnimalProcedureService animalProcedureService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _animalProcedureService = animalProcedureService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-animal-procedures")]
        public async Task<IActionResult> AddAnimalProcedure([FromBody] AnimalProcedureListVm animalProcedureListVm)
        {
            if (animalProcedureListVm == null)
            {
                return BadRequest(new AddAnimalProcedureListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal behaviors required" }

                });
            }
            if (animalProcedureListVm.AnimalProcedureVm == null)
            {
                return BadRequest(new AddAnimalProcedureListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal behaviors required" }
                });
            }

            if (animalProcedureListVm.AnimalIds.Count == 0)
            {
                return BadRequest(new AddAnimalProcedureListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var lstAnimalProcedureList = new List<AnimalProcedureListData>();
                foreach (var id in animalProcedureListVm.AnimalIds)
                {
                    List<AnimalProcedure> lstAnimalProcedure = new List<AnimalProcedure>();
                    DateTime? dtDate = null;
                    if (animalProcedureListVm?.AnimalProcedureVm?.DueDate?.Count > 0)
                    {
                        foreach (var dueDate in animalProcedureListVm?.AnimalProcedureVm?.DueDate)
                        {
                            var animalProcedure = new AnimalProcedure
                            {
                                Administerer = animalProcedureListVm?.AnimalProcedureVm?.Administerer,
                                ActionDate = animalProcedureListVm?.AnimalProcedureVm?.ActionDate,
                                AnimalId = id,
                                //Clinic = animalProcedureListVm?.AnimalProcedureVm?.Clinic,
                                DueDate = dueDate,
                                HospitalClinicId = animalProcedureListVm?.AnimalProcedureVm?.HospitalClinicId,
                                KindId = animalProcedureListVm?.AnimalProcedureVm?.KindId,
                                MicrochipNumber = animalProcedureListVm?.AnimalProcedureVm?.MicrochipNumber,
                                Notes = animalProcedureListVm?.AnimalProcedureVm ?.Notes,
                                Reminder = animalProcedureListVm.AnimalProcedureVm.Reminder,
                                Results = animalProcedureListVm?.AnimalProcedureVm ?.Results,
                                Weight = animalProcedureListVm?.AnimalProcedureVm?.Weight,
                                DateEntered = DateTime.Now,
                                EnteredBy = _userName,
                                IsDeleted = false,
                                TenantId = tenantId
                            };

                            lstAnimalProcedure.Add(animalProcedure);
                        }
                    }
                    else
                    {
                        var animalProcedure = new AnimalProcedure
                        {
                            Administerer = animalProcedureListVm?.AnimalProcedureVm?.Administerer,
                            ActionDate = animalProcedureListVm?.AnimalProcedureVm?.ActionDate,
                            AnimalId = id,
                            //Clinic = animalProcedureListVm?.AnimalProcedureVm?.Clinic,
                            DueDate = dtDate,
                            HospitalClinicId = animalProcedureListVm?.AnimalProcedureVm?.HospitalClinicId,
                            KindId = animalProcedureListVm?.AnimalProcedureVm?.KindId,
                            MicrochipNumber = animalProcedureListVm?.AnimalProcedureVm?.MicrochipNumber,
                            Notes = animalProcedureListVm?.AnimalProcedureVm?.Notes,
                            Reminder = animalProcedureListVm.AnimalProcedureVm.Reminder,
                            Results = animalProcedureListVm?.AnimalProcedureVm?.Results,
                            Weight = animalProcedureListVm?.AnimalProcedureVm?.Weight,
                            DateEntered = DateTime.Now,
                            EnteredBy = _userName,
                            IsDeleted = false,
                            TenantId = tenantId
                        };

                        lstAnimalProcedure.Add(animalProcedure);
                    }


                    //var model = _mapper.Map<AnimalProcedure>(animalProcedureListVm.AnimalProcedureVm);
                    
                    //model.AnimalId = id;
                    //model.DateEntered = DateTime.Now;
                    //model.IsDeleted = false;
                    //model.EnteredBy = _userName;
                    //model.TenantId = tenantId;
                    
                    var result = await _animalProcedureService.AddAnimalProcedureAsync(lstAnimalProcedure);
                    if (result.Success)
                    {
                        lstAnimalProcedureList.Add(new AnimalProcedureListData { AnimalId = id, AnimalProcedures = result.Data.AnimalProcedures });
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }

                return Ok(new AddAnimalProcedureListResponse
                {
                    Data = lstAnimalProcedureList,
                    Message = "Proc, Test, or Treatment added successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new AddAnimalProcedureListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid proc, test, or treatment request."
                    }
            });
        }

        [HttpGet]
        [Route("get-animal-procedure")]
        public async Task<IActionResult> GetAnimalProceduresByAnimalId(int animalId, bool reminder)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetAnimalProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalProcedureService.GetAnimalProcedureByAnimalIdAsync(animalId, false, reminder, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-animal-weight-history")]
        public async Task<IActionResult> GetAnimalWeightHisotoryByAnimalId(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetAnimalWeightHistoryResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalProcedureService.GetAnimalWeightHistoryByAnimalIdAsync(animalId, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-animal-procedure/{id}")]
        public async Task<IActionResult> UpdateAnimalProcedureById(int id, [FromBody] AnimalProcedureUpdateVm animalProcedureVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateAnimalProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Procedure Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AnimalProcedure>(animalProcedureVm);
                var vAnimalProcedure = await _animalProcedureService.GetAnimalProcedureByIdAsync(id);
                if (vAnimalProcedure == null)
                {
                    var res = new UpdateAnimalProcedureResponse()
                    {
                        Success = false,
                        Data = new UpdateAnimalProcedureData { Id = id, AnimalProcedure = vAnimalProcedure },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                var result = await _animalProcedureService.UpdateAnimalProcedureAsync(model, id);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateAnimalProcedureResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid animal procedure request." }
            });
        }

        [HttpPatch]
        [Route("delete-animal-procedure/{id}")]
        public async Task<IActionResult> DeleteAnimalProcedureById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteAnimalProcedureResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal procedure identifier must be greater than 0" }
                });
            }

            var result = await _animalProcedureService.UpdateAnimalProcedureByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-all-animal-procedures")]
        public async Task<IActionResult> GetAllAnimalProcedures(bool reminder, int days)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalProcedureService.GetAllAnimalProceduresAsync(false, reminder, days, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
