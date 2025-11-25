using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.ViewModels.AnimalTypeViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Models.ViewModels.DonationViewModel;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DonationResult;
using TYR.WEB.Models.Response.DiaryResult;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.ViewModels.DiaryViewModel;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/donation")]
    [ApiController]
    public class DonationController : ControllerBase
    {
        private readonly IDonationService _donationService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public DonationController(IDonationService donationService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _donationService = donationService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-donation")]
        public async Task<IActionResult> AddDonationAsync([FromBody] DonationVm donationVm)
        {
            if(donationVm == null)
            {
                return BadRequest(new AddDonationResponse
                {
                    Success = false,
                    StatusCode = 400,
                    Errors = new List<string>() {
                        "Invalid donation request."
                    }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);

                var model = _mapper.Map<Donation>(donationVm);
                model.EnteredBy = _userName;
                model.TenantId = tenantId;
                model.DateEntered = DateTime.Now;
                var response = await _donationService.AddDonationAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddDonationResponse
            {
                Success = false,
                StatusCode = 400,
                Errors = new List<string>() {
                        "Invalid donation request."
                    }
            });
        }

        [HttpGet]
        [Route("get-donation")]
        public async Task<IActionResult> GetDonationsByPcoIdAsync(int pcoId)
        {
            if (pcoId <= 0)
            {
                return BadRequest(new GetDonationResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Person identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _donationService.GetDonationByPcoIdAsync(pcoId, false, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-donation/{id}")]
        public async Task<IActionResult> UpdateDonationByIdAsync(int id, [FromBody] DonationVm donationVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateDonationResponse
                {
                    Success = false,
                    StatusCode = 400,
                    Errors = new List<string>() { "Donation must be greater than 0" }
                });
            }

            if (donationVm == null)
            {
                return BadRequest(new UpdateDonationResponse
                {
                    Success = false,
                    StatusCode = 400,
                    Errors = new List<string>() {
                        "Invalid donation request."
                    }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Donation>(donationVm);
                var vDonation = await _donationService.GetDonationByIdAsync(id);
                if (vDonation == null)
                {
                    var res = new UpdateDonationResponse()
                    {
                        Success = false,
                        Data = new UpdateDonationData { Id = id, Donation = vDonation },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                var result = await _donationService.UpdateDonationAsync(id, model);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateDonationResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid donation request." }
            });
        }

        [HttpPatch]
        [Route("delete-donation/{id}")]
        public async Task<IActionResult> DeleteDonationById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteDonationResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Donation identifier must be greater than 0" }
                });
            }

            var result = await _donationService.UpdateDonationByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }
    }
}
