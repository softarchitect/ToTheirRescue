using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DiaryResult;
using TYR.WEB.Models.ViewModels.DiaryViewModel;
using TYR.WEB.Services.Services;
using TYR.WEB.Models.ViewModels.SOAPViewModel;
using TYR.WEB.Models.Response.SOAPResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/soap")]
    [ApiController]
    public class SOAPController : ControllerBase
    {
        private readonly ISOAPService _soapService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;

        public SOAPController(ISOAPService soapService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IUserService userService)
        {
            _soapService = soapService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
        }

        [HttpPost]
        [Route("add-soap")]
        public async Task<IActionResult> AddSOAPAsync([FromBody] SOAPListVm soapListVm)
        {
            if (soapListVm == null)
            {
                return BadRequest(new AddSOAPListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "SOAP entry required" }

                });
            }
            if (soapListVm.SOAPVm == null)
            {
                return BadRequest(new AddSOAPListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "SOAP entry required" }
                });
            }

            if (soapListVm.AnimalIds.Count == 0)
            {
                return BadRequest(new AddSOAPListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var lstSOAPList = new List<AddSOAPListData>();
                
                foreach (var id in soapListVm.AnimalIds)
                {
                    var model = _mapper.Map<SOAP>(soapListVm.SOAPVm);

                    model.AnimalId = id;
                    model.DateEntered = DateTime.Now;
                    model.IsDeleted = false;
                    model.EnteredBy = _userName;
                    model.TenantId = tenantId;
                    
                        
                    var result = await _soapService.AddSOAPAsync(model);
                    if (result.Success)
                    {
                        lstSOAPList.Add(new AddSOAPListData { AnimalId = id, TenantId = tenantId, SOAP = result.Data.SOAP });
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }
                

                return Ok(new AddSOAPListResponse
                {
                    Data = lstSOAPList,
                    Message = "SOAP entry added successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new AddSOAPListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid SOAP entry request."
                    }
            });
        }

        [HttpGet]
        [Route("get-soap")]
        public async Task<IActionResult> GetSOAPsByAnimalIdAsync(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetSOAPResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _soapService.GetSOAPByAnimalIdAsync(animalId, false, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-soap-tenant")]
        public async Task<IActionResult> GetSOAPByTenantIdAsync()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _soapService.GetSOAPByTenantIdAsync(false, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-soap/{id}")]
        public async Task<IActionResult> UpdateSOAPByIdAsync(int id, [FromBody] SOAPVm soapVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSOAPResponse
                {
                    Success = false,
                    Errors = new List<string>() { "SOAP entry must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SOAP>(soapVm);
                var vSOAP = await _soapService.GetSOAPByIdAsync(id);
                if (vSOAP == null)
                {
                    var res = new UpdateSOAPResponse()
                    {
                        Success = false,
                        Data = new UpdateSOAPData { Id = id, SOAP = vSOAP },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                var result = await _soapService.UpdateSOAPAsync(id, model);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSOAPResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid soap entry request." }
            });
        }

        [HttpPatch]
        [Route("delete-soap/{id}")]
        public async Task<IActionResult> DeleteSOAPById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSOAPResponse
                {
                    Success = false,
                    Errors = new List<string>() { "SOAP entry identifier must be greater than 0" }
                });
            }

            var result = await _soapService.UpdateSOAPByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }
    }
}
