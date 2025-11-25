using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.TenantResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/tenant")]
    [ApiController]
    public class TenantController : ControllerBase
    {
        private readonly ITenantService _tenantService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor; 
        private readonly string _userName;
        private readonly IUserService _userService;
        private readonly ICountryService _countryService;
        public TenantController(ITenantService tenantService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService, ICountryService countryService)
        {
            _tenantService = tenantService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
            _countryService = countryService;
        }

        [HttpPost]
        [Route("create-tenant")]
        public async Task<IActionResult> CreateTenant([FromBody]CreateTenantVm tenantVm)
        {
            if(ModelState.IsValid)
            {
                var model = _mapper.Map<Tenant>(tenantVm);
                model.DateEntered = DateTime.Now;
                model.Status = "Registered"; // This should be come from frontend either active or trialer. SHOULD NOT BE HARDCODED VALUE HERE
                model.EnteredBy = _userName;

                var result = await _tenantService.CreateTenantAsync(model);
                if(result != null && result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new CreateTenantResponse
            {
                Message = ResponseMessage.FAILURE,
                Success = false,
                Errors = new List<string>() {
                        "Invalid rescue request."
                    }
            });
        }

        [HttpGet]
        [Route("get-tenant-info")]
        public async Task<IActionResult> GetTenantInfo()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var tenantInfo = await _tenantService.GetTenantbyIdAsync(tenantId);
            if (tenantInfo != null)
            {
                var vCountry = await _countryService.GetByIdAsync(tenantInfo.CountryId.Value);

                var model = _mapper.Map<CreateTenantVm>(tenantInfo);
                model.CountryName = vCountry != null && vCountry.Data.Country != null ? vCountry.Data.Country.CountryName : string.Empty;
                model.CountryISO2Code = vCountry != null && vCountry.Data.Country != null ? vCountry.Data.Country.ISO2Code : string.Empty;
                model.CountryISDCode = vCountry.Data.Country.ISDCode;
                model.Phone = !string.IsNullOrEmpty(tenantInfo.Phone) ? tenantInfo.Phone : string.Empty;
                var info = new GetTenantResponse
                {
                    Data = new GetTenantData { Id = tenantInfo.ID, Tenant = model },
                    Message = ResponseMessage.SUCCESS,
                    StatusCode = 200,
                    Success = true
                };
                return Ok(info);
            }

            return BadRequest(new GetTenantResponse
            {
                Message = ResponseMessage.FAILURE,
                Success = false,
                Errors = new List<string>() { "Oops! Something wrong getting rescue information." }
            });
        }

        [HttpPost]
        [Route("update-tenant/{id}")]
        public async Task<IActionResult> UpdateTenantInfo(int id, [FromBody] TenantVm tenantVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateTenantResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Tenant>(tenantVm);
                var vTenant = await _tenantService.GetTenantbyIdAsync(id);
                if (vTenant is null)
                {
                    return Ok(new UpdateTenantResponse { 
                        Data = new UpdateTenantData { Id = id },
                        Success = true,
                        Message = "No record found",
                        StatusCode = 200
                    });
                }

                vTenant.Name = model.Name;
                vTenant.TenantAcronym = model.TenantAcronym ?? vTenant.TenantAcronym;
                vTenant.Street = model.Street ?? vTenant.Street;
                vTenant.City = model.City ?? vTenant.City;
                vTenant.State = model.State ?? vTenant.State;
                vTenant.Zip = model.Zip ?? vTenant.Zip;
                vTenant.CountryId = model.CountryId ?? vTenant.CountryId;
                vTenant.Phone = model.Phone ?? vTenant.Phone;
                vTenant.Website = model.Website ?? vTenant.Website;
                vTenant.NumberUsersPurchased = model.NumberUsersPurchased > 0 ? model.NumberUsersPurchased : vTenant.NumberUsersPurchased;
                vTenant.Notes = model.Notes ?? vTenant.Notes;
                vTenant.MailList = model.MailList ? model.MailList : vTenant.MailList;
                vTenant.EnteredBy = model.EnteredBy ?? vTenant.EnteredBy;
                vTenant.EmailAddress = model.EmailAddress ?? vTenant.EmailAddress;
                vTenant.ModifiedBy = _userName;

                return Ok(await _tenantService.UpdateAsync(vTenant));
            }

            return BadRequest(new UpdateTenantResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid rescue request."
                    }
            });
        }
    }
}
