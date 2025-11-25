using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;
using TYR.WEB.Models.ViewModels.VolunteerActivityViewModel;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.ViewModels.SAVolunteerActivityViewModel;
using TYR.WEB.Models.Response.SAVolunteerActivityResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/savolunteer-activity")]
    [ApiController]
    public class SAVolunteerActivityController : ControllerBase
    {
        private readonly ISAVolunteerActivityService _saVolunteerActivityService;
        private readonly IMapper _mapper;
        //private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        public SAVolunteerActivityController(ISAVolunteerActivityService saVolunteerActivityService, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _saVolunteerActivityService = saVolunteerActivityService;
            //_httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create-sa-volunteer-activity")]
        public async Task<IActionResult> AddSAVolunteerActivity([FromBody] SAVolunteerActivityVm saVolunteerActivityVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAVolunteerActivity>(saVolunteerActivityVm);

                var result = await _saVolunteerActivityService.AvailableSAVolunteerActivities(false, model.SAVolunteerActivityName);
                if (result.Success && result.Data.IsAvailable.Equals(false))
                {
                    return Ok(result);
                }
                else if (result.Success.Equals(false))
                {
                    return BadRequest(result);
                }

                model.EnteredBy = _userName;
                var response = await _saVolunteerActivityService.AddSAVolunteerActivityAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddSAVolunteerActivityResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Volunteer Activity request." }
            });
        }

        [HttpGet]
        [Route("get-sa-volunteer-activity")]
        public async Task<IActionResult> GetAllActiveSAVolunteerActivities()
        {
            return Ok(await _saVolunteerActivityService.GetAllSAVolunteerActivitiesAsync(false));
        }

        [HttpPatch]
        [Route("delete-sa-volunteer-activity/{id}")]
        public async Task<IActionResult> DeleteSAVolunteerActivity(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSAVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Volunteer Activity Identifier must be greater than 0" }
                });
            }

            var result = await _saVolunteerActivityService.UpdateSAVolunteerActivityByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-sa-volunteer-activity/{id}")]
        public async Task<IActionResult> UpdateSAVolunteerActivity(int id, [FromBody] SAVolunteerActivityVm saVolunteerActivityVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSAVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Volunteer Activity Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAVolunteerActivity>(saVolunteerActivityVm);
                var vSAVolunteerActivity = await _saVolunteerActivityService.GetByIdAsync(id);
                if (vSAVolunteerActivity == null)
                {
                    var res = new UpdateSAVolunteerActivityResponse()
                    {
                        Success = false,
                        Data = new UpdateSAVolunteerActivityData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vSAVolunteerActivity.SAVolunteerActivityName = model.SAVolunteerActivityName;
                vSAVolunteerActivity.ModifiedBy = _userName;
                vSAVolunteerActivity.DateModified = DateTime.Now;
                var result = await _saVolunteerActivityService.UpdateSAVolunteerActivity(vSAVolunteerActivity);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSAVolunteerActivityResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Volunteer Activity Identifier request." }
            });
        }

        [HttpGet]
        [Route("available-sa-volunteer-activity")]
        public async Task<IActionResult> GetAvailableSAVolunteerActivities(string saVolunteerActivityName)
        {
            if (string.IsNullOrEmpty(saVolunteerActivityName))
            {
                return BadRequest(new GetAvailableSAVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Volunteer Activity is required." }
                });
            }
            
            var result = await _saVolunteerActivityService.AvailableSAVolunteerActivities(false, saVolunteerActivityName);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
