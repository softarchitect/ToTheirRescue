using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.ViewModels.DiaryViewModel;
using TYR.WEB.Models.Response.DiaryResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/diary")]
    [ApiController]
    public class DiaryController : ControllerBase
    {
        private readonly IDiaryService _diaryService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public DiaryController(IDiaryService diaryService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _diaryService = diaryService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-diary")]
        public async Task<IActionResult> AddDiaryAsync([FromBody] DiaryListVm diaryListVm)
        {
            if (diaryListVm == null)
            {
                return BadRequest(new AddDiaryListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Diary entry required" }

                });
            }
            if (diaryListVm.DiaryVm == null)
            {
                return BadRequest(new AddDiaryListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Diary entry required" }
                });
            }

            if (string.IsNullOrEmpty(diaryListVm.EntityType))
            {
                return BadRequest(new AddDiaryListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Entity type required" }
                });
            }

            if (diaryListVm.EntityType.ToLower().Trim().Equals("animal") && diaryListVm.AnimalIds.Count == 0)
            {
                return BadRequest(new AddDiaryListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var lstDiaryList = new List<AddDiaryListData>();
                if (diaryListVm.EntityType.ToLower().Trim().Equals("animal"))
                {
                    foreach (var id in diaryListVm.AnimalIds)
                    {
                        var model = _mapper.Map<Diary>(diaryListVm.DiaryVm);

                        model.AnimalId = id;
                        model.DateEntered = DateTime.Now;
                        model.IsDeleted = false;
                        model.EnteredBy = _userName;
                        model.TenantId = tenantId;
                        model.TenantOrAnimal = diaryListVm.EntityType.ToLower().Trim();

                        var result = await _diaryService.AddDiaryAsync(model);
                        if (result.Success)
                        {
                            lstDiaryList.Add(new AddDiaryListData { AnimalId = id, TenantId = tenantId, Diary = result.Data.Diary });
                        }
                        else
                        {
                            return BadRequest(result);
                        }
                    }
                }
                else if(diaryListVm.EntityType.ToLower().Trim().Equals("tenant"))
                {
                    var model = _mapper.Map<Diary>(diaryListVm.DiaryVm);

                    model.AnimalId = 0;
                    model.DateEntered = DateTime.Now;
                    model.IsDeleted = false;
                    model.EnteredBy = _userName;
                    model.TenantId = tenantId;
                    model.TenantOrAnimal = diaryListVm.EntityType.ToLower().Trim();

                    var result = await _diaryService.AddDiaryAsync(model);
                    if (result.Success)
                    {
                        lstDiaryList.Add(new AddDiaryListData { AnimalId = 0, TenantId = tenantId, Diary = result.Data.Diary });
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }
                
                return Ok(new AddDiaryListResponse
                {
                    Data = lstDiaryList,
                    Message = "Diary entry added successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new AddDiaryListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Diary entry request."
                    }
            });
        }

        [HttpGet]
        [Route("get-diary")]
        public async Task<IActionResult> GetDiariesByAnimalIdAsync(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetDiaryResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _diaryService.GetDiaryByAnimalIdAsync(animalId, false, "animal", tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-diary-tenant")]
        public async Task<IActionResult> GetDiaryByTenantIdAsync()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _diaryService.GetDiaryByTenantIdAsync("tenant", false, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-diary/{id}")]
        public async Task<IActionResult> UpdateDiaryByIdAsync(int id, [FromBody] DiaryVm diaryVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateDiaryResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Diary entry must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Diary>(diaryVm);
                var vDiary = await _diaryService.GetDiaryByIdAsync(id);
                if (vDiary == null)
                {
                    var res = new UpdateDiaryResponse()
                    {
                        Success = false,
                        Data = new UpdateDiaryData { Id = id, Diary = vDiary },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                var result = await _diaryService.UpdateDiaryAsync(id, model);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateDiaryResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid diary entry request." }
            });
        }

        [HttpPatch]
        [Route("delete-diary/{id}")]
        public async Task<IActionResult> DeleteDiaryById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteDiaryResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Diary entry identifier must be greater than 0" }
                });
            }

            var result = await _diaryService.UpdateDiaryByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }
    }
}
