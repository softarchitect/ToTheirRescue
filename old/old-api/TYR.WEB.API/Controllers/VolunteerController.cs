using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;
using TYR.WEB.Models.ViewModels.VolunteerActivityViewModel;
using TYR.WEB.Models.ViewModels.VolunteerViewModel;
using TYR.WEB.Models.Response.VolunteerResult;
using System;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using System.Linq;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/volunteer")]
    [ApiController]
    public class VolunteerController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IMapper _mapper;
        private readonly IVolunteerService _volunteerService;
        private readonly IUserService _userService;

        public VolunteerController(IHttpContextAccessor httpContextAccessor, IMapper mapper, IVolunteerService volunteerService, IUserService userService)
        {
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
            _volunteerService = volunteerService;
        }

        [HttpPost]
        [Route("upsert-volunteer")]
        public async Task<IActionResult> UpsertVolunteerPersonActivity([FromBody] VolunteerVm volunteerVm)
        {
            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                int? pcoId = volunteerVm?.PcoId;
                DateTime? dtTime = null;

                var vVolunteer = new Volunteer { 
                    Active = volunteerVm.Active,
                    DateActive = volunteerVm.DateActive,
                    //DateEntered = DateTime.Now,
                    DateInactive = volunteerVm.DateInactive ?? dtTime, // Using null-coalescing operator
                    //EnteredBy = _userName,
                    //IsDeleted = false,
                    Notes = volunteerVm.Notes,
                    PcoId = volunteerVm.PcoId,
                    TenantId = tenantId
                };

                var lstVolunteerPersonActivity = new List<VolunteerPersonActivity>();

                foreach(var id in volunteerVm.VolunteerActivityIds)
                {
                    var vVolunteerPersonActivity = new VolunteerPersonActivity
                    {
                        //IsDeleted = false,
                        PcoId = volunteerVm.PcoId,
                        TenantId = tenantId,
                        //DateEntered = DateTime.Now,
                        //EnteredBy = _userName,
                        VolunteerActivityId = id
                    };
                    lstVolunteerPersonActivity.Add(vVolunteerPersonActivity);
                }


                var responseVolunteer = await _volunteerService.UpsertVolunteerAsync(vVolunteer, lstVolunteerPersonActivity);
                if (responseVolunteer.Success) return Ok(responseVolunteer);

                return BadRequest(responseVolunteer);
            }

            return BadRequest(new UpsertVolunteerResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Volunteer request." }
            });
        }

        [HttpGet]
        [Route("get-volunteers")]
        public async Task<IActionResult> GetAllActiveVolunteerActivities(int pcoId)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _volunteerService.GetVolunteersByPcoIdAsync(pcoId, tenantId));
        }

        [HttpPost]
        [Route("update-volunteer/{id}")]
        public async Task<IActionResult> UpdateVolunteer(int id, [FromBody] VolunteerVm volunteerVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string> { "Volunteer Person Identifier must be greater than 0" }
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new UpdateVolunteerActivityResponse
                {
                    Success = false,
                    Errors = new List<string> { "Invalid Volunteer request." }
                });
            }

            var tenantId = await _userService.GetTenantIdByUserName(_userName);

            var vVolunteer = new Volunteer
            {
                Active = volunteerVm.Active,
                DateInactive = volunteerVm.DateInactive, // No need for null-coalescing with nullable type
                DateModified = DateTime.Now, // Use UtcNow for consistency
                ModifiedBy = _userName,
                Notes = volunteerVm.Notes,
                PcoId = volunteerVm?.PcoId
            };

            var lstVolunteerPersonActivity = volunteerVm.VolunteerActivityIds
                .Select(activityId => new VolunteerPersonActivity
                {
                    IsDeleted = false,
                    PcoId = volunteerVm?.PcoId,
                    TenantId = tenantId,
                    //DateEntered = DateTime.Now, // Use UtcNow
                    //EnteredBy = _userName,
                    VolunteerActivityId = activityId
                })
                .ToList();

            var result = await _volunteerService.UpdateVolunteerAsync(id, vVolunteer, lstVolunteerPersonActivity, tenantId);

            return result.Success ? Ok(result) : BadRequest(result);
        }
        //public async Task<IActionResult> UpdateVolunteer(int id, [FromBody] VolunteerVm volunteerVm)
        //{
        //    if (id <= 0)
        //    {
        //        return BadRequest(new UpdateVolunteerActivityResponse
        //        {
        //            Success = false,
        //            Errors = new List<string>() { "Volunteer Person Identifier must be greater than 0" }
        //        });
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        DateTime? dtTime = null;
        //        var tenantId = await _userService.GetTenantIdByUserName(_userName);
        //        var vVolunteer = new Volunteer { 
        //            Active = volunteerVm.Active,
        //            DateInactive = volunteerVm.DateInactive ?? dtTime, // Using null-coalescing operator
        //            DateModified = DateTime.Now,
        //            ModifiedBy = _userName,
        //            Notes = volunteerVm.Notes,
        //            PcoId = volunteerVm?.PcoId
        //        };

        //        var lstVolunteerPersonActivity = new List<VolunteerPersonActivity>();
        //        foreach(var activityId in volunteerVm.VolunteerActivityIds)
        //        {
        //            var vVolunteerPersonActivity = new VolunteerPersonActivity { 
        //                IsDeleted = false,
        //                PcoId = volunteerVm?.PcoId,
        //                TenantId = tenantId,
        //                DateEntered = DateTime.Now,
        //                EnteredBy = _userName,
        //                VolunteerActivityId = activityId
        //            };
        //            lstVolunteerPersonActivity.Add(vVolunteerPersonActivity);
        //        }

        //        var result = await _volunteerService.UpdateVolunteerAsync(id, vVolunteer, lstVolunteerPersonActivity, tenantId);
        //        if (result.Success) return Ok(result);

        //        return BadRequest(result);
        //    }

        //    return BadRequest(new UpdateVolunteerActivityResponse
        //    {
        //        Success = false,
        //        Errors = new List<string>() { "Invalid Volunteer request." }
        //    });
        //}
    }
}
