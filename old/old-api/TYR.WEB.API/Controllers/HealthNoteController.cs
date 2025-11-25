using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DonationResult;
using TYR.WEB.Models.ViewModels.DonationViewModel;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.ViewModels.HealthNoteViewModel;
using TYR.WEB.Models.Response.HealthNoteResult;
using TYR.WEB.Models.Response.DiaryResult;
using TYR.WEB.Models.Response.MedResult;
using TYR.WEB.Models.ViewModels.MedViewModel;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/healthnote")]
    [ApiController]
    public class HealthNoteController : ControllerBase
    {
        private readonly IHealthNoteService _healthNoteService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public HealthNoteController(IHealthNoteService healthNoteService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _healthNoteService = healthNoteService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-healthnote")]
        public async Task<IActionResult> AddHealthNoteAsync([FromBody] HealthNoteVm healthNoteVm)
        {
            if (healthNoteVm == null)
            {
                return BadRequest(new AddHealthNoteResponse
                {
                    Success = false,
                    StatusCode = 400,
                    Errors = new List<string>() {
                        "Invalid health note request."
                    }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);

                var model = _mapper.Map<HealthNote>(healthNoteVm);
                model.EnteredBy = _userName;
                model.TenantId = tenantId;
                model.DateEntered = DateTime.Now;
                model.ActionDate = DateTime.Now;
                model.IsDeleted = false;
                var response = await _healthNoteService.AddHealthNoteAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddHealthNoteResponse
            {
                Success = false,
                StatusCode = 400,
                Errors = new List<string>() {
                        "Invalid health note request."
                    }
            });
        }

        [HttpGet]
        [Route("get-healthnote")]
        public async Task<IActionResult> GetHealthNoteByAnimalIdAsync(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetHealthNoteResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _healthNoteService.GetHealthNoteByAnimalIdAsync(animalId, false, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-healthnote/{id}")]
        public async Task<IActionResult> UpdateHealthNoteByIdAsync(int id, [FromBody] HealthNoteVm healthNoteVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateHealthNoteResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Health Note Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<HealthNote>(healthNoteVm);
                var vHealthNote = await _healthNoteService.GetHealthNoteByIdAsync(id);
                if (vHealthNote == null)
                {
                    var res = new UpdateHealthNoteResponse()
                    {
                        Success = false,
                        Data = new UpdateHealthNoteData { Id = id, HealthNote = vHealthNote },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                //model.DateModified = DateTime.UtcNow;
                //model.ModifiedBy = _userName;
                //model.TenantId = await _userService.GetTenantIdByUserName(_userName);

                var result = await _healthNoteService.UpdateHealthNoteAsync(id, model);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateHealthNoteResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid health note request." }
            });
        }

        [HttpPatch]
        [Route("delete-healthnote/{id}")]
        public async Task<IActionResult> DeleteHealthNoteByIdAsync(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteHealthNoteResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Health Note identifier must be greater than 0" }
                });
            }

            var result = await _healthNoteService.UpdateHealthNoteByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }
    }
}
