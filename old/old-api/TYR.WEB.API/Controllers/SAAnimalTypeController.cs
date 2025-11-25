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
using TYR.WEB.Models.ViewModels.SAAnimalTypeViewModel;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAAnimalTypeResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/saanimaltype")]
    [ApiController]
    public class SAAnimalTypeController : ControllerBase
    {
        private readonly ISAAnimalTypeService _saAnimalTypeService;
        private readonly IMapper _mapper;
        //private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        //private readonly IUserService _userService;
        public SAAnimalTypeController(ISAAnimalTypeService saAnimalTypeService, IHttpContextAccessor httpContextAccessor, IMapper mapper) //, IUserService userService)
        {
            _saAnimalTypeService = saAnimalTypeService;
            //_httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            //_userService = userService;
        }

        [HttpPost]
        [Route("create-sa-animal-type")]
        public async Task<IActionResult> AddSAAnimalType([FromBody] SAAnimalTypeVm saAnimalTypeVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAAnimalType>(saAnimalTypeVm);
                var result = await _saAnimalTypeService.AvailableSAAnimalType(false, model.TypeName);
                if (result.Success && result.Data.IsAvailable.Equals(false))
                {
                    return Ok(result);
                }
                else if (result.Success.Equals(false))
                {
                    return BadRequest(result);
                }

                model.EnteredBy = _userName;
                model.DateEntered = DateTime.Now;
                var response = await _saAnimalTypeService.AddSAAnimalTypeAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddSAAnimalTypeResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid SA animal type request."
                    }
            });

        }

        [HttpGet]
        [Route("get-sa-animal-type")]
        public async Task<IActionResult> GetAllActiveSAAnimalTypes()
        {
            return Ok(await _saAnimalTypeService.GetAllSAAnimalTypeAsync(false));
        }

        [HttpPatch]
        [Route("delete-sa-animal-type/{id}")]
        public async Task<IActionResult> DeleteSAAnimalType(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSAAnimalTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "SA Animal Identifier must be greater than 0" }
                });
            }

            var result = await _saAnimalTypeService.UpdateSAAnimalTypeByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-sa-animal-type/{id}")]
        public async Task<IActionResult> UpdateSAAnimalType(int id, [FromBody] SAAnimalTypeVm saAnimalTypeVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSAAnimalTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "SA Animal Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAAnimalType>(saAnimalTypeVm);
                var vSAAnimalType = await _saAnimalTypeService.GetByIdAsync(id);
                if (vSAAnimalType == null)
                {
                    var res = new UpdateSAAnimalTypeResponse()
                    {
                        Success = false,
                        Data = new UpdateSAAnimalTypeData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vSAAnimalType.TypeName = string.IsNullOrEmpty(model.TypeName) ? vSAAnimalType.TypeName : model.TypeName;
                var result = await _saAnimalTypeService.UpdateSAAnimalTypeAsync(vSAAnimalType);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSAAnimalTypeResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid SA animal type request." }
            });
        }

        [HttpGet]
        [Route("available-sa-animal-type")]
        public async Task<IActionResult> GetAvailableSAAnimalType(string typeName)
        {
            if (string.IsNullOrEmpty(typeName))
            {
                return BadRequest(new GetAvailableSAAnimalTypeResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Type Name is required." }
                });
            }
            
            var result = await _saAnimalTypeService.AvailableSAAnimalType(false, typeName);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

    }
}
