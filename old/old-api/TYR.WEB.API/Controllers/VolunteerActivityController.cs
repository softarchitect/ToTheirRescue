using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;
using TYR.WEB.Models.ViewModels.VolunteerActivityViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/volunteer-activity")]
    [ApiController]
    public class VolunteerActivityController : ControllerBase
    {
        private readonly IVolunteerActivityService _volunteerActivityService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public VolunteerActivityController(IVolunteerActivityService volunteerActivityService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _volunteerActivityService = volunteerActivityService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost]
        [Route("create-volunteer-activity")]
        public async Task<IActionResult> AddVolunteerActivity([FromBody] VolunteerActivityVm volunteerActivityVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<VolunteerActivity>(volunteerActivityVm);

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _volunteerActivityService.AvailableVolunteerActivities(false, model.VolunteerActivityName, tenantId);
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
                var response = await _volunteerActivityService.AddVolunteerActivityAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddVolunteerActivityResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Volunteer Activity request." }
            });
        }

        [HttpGet]
        [Route("get-volunteer-activity")]
        public async Task<IActionResult> GetAllActiveVolunteerActivities()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _volunteerActivityService.GetAllVolunteerActivitiesAsync(false, tenantId));
        }

        [HttpPatch]
        [Route("delete-volunteer-activity/{id}")]
        public async Task<IActionResult> DeleteVolunteerActivity(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Volunteer Activity Identifier must be greater than 0" }
                });
            }

            var result = await _volunteerActivityService.UpdateVolunteerActivityByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-volunteer-activity/{id}")]
        public async Task<IActionResult> UpdateVolunteerActivity(int id, [FromBody] VolunteerActivityVm volunteerActivityVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Volunteer Activity Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<VolunteerActivity>(volunteerActivityVm);
                var vVolunteerActivity = await _volunteerActivityService.GetByIdAsync(id);
                if (vVolunteerActivity == null)
                {
                    var res = new UpdateVolunteerActivityResponse()
                    {
                        Success = false,
                        Data = new UpdateVolunteerActivityData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vVolunteerActivity.VolunteerActivityName = model.VolunteerActivityName;
                vVolunteerActivity.ModifiedBy = _userName;
                vVolunteerActivity.DateModified = DateTime.Now;
                var result = await _volunteerActivityService.UpdateVolunteerActivity(vVolunteerActivity);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateVolunteerActivityResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Volunteer Activity Identifier request." }
            });
        }

        [HttpGet]
        [Route("available-volunteer-activity")]
        public async Task<IActionResult> GetAvailableVolunteerActivities(string volunteerActivityName)
        {
            if (string.IsNullOrEmpty(volunteerActivityName))
            {
                return BadRequest(new GetAvailableVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Volunteer Activity is required." }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _volunteerActivityService.AvailableVolunteerActivities(false, volunteerActivityName, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
