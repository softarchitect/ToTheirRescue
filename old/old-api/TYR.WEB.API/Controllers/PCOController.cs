using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using TYR.WEB.Models.Response.PCOResult;
using TYR.WEB.Models.ViewModels.PCO;
using TYR.WEB.Models.Constants;
using TYR.WEB.Services.Interfaces;
namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/PCO")]
    [ApiController]
    public class PcoController : ControllerBase
    {
        private readonly IPCOService _ipcoService;
        private readonly IMapper _mapper;
        private readonly string _userName;
        private readonly IUserService _userService;
        private readonly ITenantService _tenantService;
        private readonly IAnimalMilestoneService _animalMilestoneService;
        public record UrlQueryParameters(int Limit=20, int Page=1);
        public PcoController(IPCOService pcoService, 
            IHttpContextAccessor httpContextAccessor, 
            IMapper mapper, 
            IUserService userService, 
            ITenantService tenantService,
            IAnimalMilestoneService animalMilestoneService)
        {
            _ipcoService = pcoService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
            _tenantService = tenantService;
            _animalMilestoneService = animalMilestoneService;
        }

        [HttpPost]
        [Route("create-pco")]
        public async Task<IActionResult> AddPco([FromBody] AddPCOVm pcoVm, bool force)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<PCO>(pcoVm);
                if (model.EntityType.Equals(null) || model.EntityType.Equals(string.Empty) || model.State.Length > 50 )
                {
                    return Ok(new AddPCOResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "Invalid PCO request." },
                        StatusCode = 200
                    });
                }

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                if (!force)
                {
                    var result = await _ipcoService.AvailablePCO(false, model, tenantId);
                    if (result != null && result.Success && !result.Data.IsAvailable)
                    {
                        return Ok(new AddPCOResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "PCO name already taken." },
                            StatusCode=200
                            
                        });
                    }
                }
                var tenant = await _tenantService.GetTenantbyIdAsync(tenantId);
              
                model.EntityType = model.EntityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
                //model.CountryCode = model.CountryCode == string.Empty ? tenant.CountryCode : model.CountryCode;
                model.CountryId = pcoVm.CountryId == 0  ? tenant.CountryId : model.CountryId;
                model.EnteredBy = _userName;
                model.TenantId = tenantId;
                model.DateEntered = DateTime.Now;
                return Ok(await _ipcoService.AddNewPCO(model, tenantId));

            }
            else
            {
                return BadRequest(new AddPCOResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Invalid Pco request." },
                    StatusCode = 200
                });
            }
        }

        [HttpGet]
        [Route("get-pco")]
        public async Task<IActionResult> GetPcoList([FromQuery] UrlQueryParameters urlQueryParameters, string? searchText, string entityType, bool isDeleted )
        {
           var tenantId = await _userService.GetTenantIdByUserName(_userName); 
           return Ok(await _ipcoService.GetPCOListAsync(tenantId, isDeleted, searchText, entityType,  urlQueryParameters.Limit, urlQueryParameters.Page));
        }
       
        [HttpPut]
        [Route("update-pco/{id}")]
        public async Task<IActionResult> UpdatePco([FromBody] AddPCOVm pcoVm, int id)
        {

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<PCO>(pcoVm);
                return Ok(await _ipcoService.UpdatePCOByIdAsync(model, id, _userName));
            }
            else
            {
                return BadRequest(new UpdatePCOResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Invalid PCO request." }
                });
            }
        }

        [HttpPatch]
        [Route("delete-pco/{id}")]
        public async Task<IActionResult> DeletePco(int id)
        {
            try
            {
                var isExistInAnimalMileStone = await _animalMilestoneService.GetAnimalMilestoneByPCO(id);
                if (isExistInAnimalMileStone.Count==0)
                {
                    return Ok(await _ipcoService.DeletePcoByIdAsync(id));
                }
                else
                {
                    return Ok(new DeletePCOResponse
                    {
                        Errors = new List<string> { "You can not delete this PCO as PCO is linked with intake milestone!"},
                        StatusCode = 200,
                        Success = false
                    });

                }
            }
            catch(Exception ex)
            {
                return Ok(new DeletePCOResponse
                {
                    Errors = new List<string> { "PCO not found!", ex.InnerException.ToString() },
                    StatusCode = 200,
                    Success = false
                });
            }
        }
        [HttpGet]
        [Route("search-autocomplete")]
        public async Task<IActionResult> SearchAutoComplete(string searchText,  string entityType,  int limit)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _ipcoService.PCOSearchAutoCompleteListAsync(tenantId, searchText, entityType ,limit));
        }

        [HttpGet]
        [Route("auto-complete-pco-list")]
        public async Task<IActionResult> AutoCompletePcoList([FromQuery] UrlQueryParameters urlQueryParameters,bool isDeleted, string? searchText, string entityType)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _ipcoService.AutoCompletePcoListAsync(tenantId, isDeleted, searchText,entityType, urlQueryParameters.Limit, urlQueryParameters.Page));
        }

        [HttpGet]
        [Route("get-pco-hospitals")]
        public async Task<IActionResult> GetPCOHospital()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _ipcoService.GetPCOHospitalsAsync(tenantId));
        }

        [HttpGet]
        [Route("get-pco-other-rescues")]
        public async Task<IActionResult> GetPCOOtherRescues()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _ipcoService.GetPCOOtherRescuesAsync(tenantId));
        }

        [HttpGet]
        [Route("get-pco-history")]
        public async Task<IActionResult> GetPcosHistory(int pcoId)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _ipcoService.GetPcosHistoryAsync(pcoId, tenantId));
        }
    }
}
