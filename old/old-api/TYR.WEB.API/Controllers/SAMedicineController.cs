using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using TYR.WEB.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAMedicineResult;
using TYR.WEB.Models.ViewModels.SAMedicineViewModel;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/samedicine")]
    [ApiController]
    public class SAMedicineController : ControllerBase
    {
        private readonly ISAMedicineService _saMedicineService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        public SAMedicineController(ISAMedicineService saMedicineService, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _saMedicineService = saMedicineService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create-samedicine")]
        public async Task<IActionResult> AddSAMedicine([FromBody] SAMedicineVm saMedicineVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAMedicine>(saMedicineVm);

                var result = await _saMedicineService.AvailableSAMedicinesAsync(false, model.MedicineName);
                if (result.Success && result.Data.IsAvailable.Equals(false))
                {
                    return Ok(result);
                }
                else if (result.Success.Equals(false))
                {
                    return BadRequest(result);
                }

                model.EnteredBy = _userName;
                var response = await _saMedicineService.AddSAMedicineAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddSAMedicineResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Medicine request." }
            });
        }

        [HttpGet]
        [Route("get-samedicine")]
        public async Task<IActionResult> GetAllActiveSAMedicines()
        {
            return Ok(await _saMedicineService.GetAllSAMedicinesAsync(false));
        }

        [HttpPatch]
        [Route("delete-samedicine/{id}")]
        public async Task<IActionResult> DeleteSAMedicine(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteSAMedicineResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Medicine Identifier must be greater than 0" }
                });
            }

            var result = await _saMedicineService.UpdateSAMedicineByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-samedicine/{id}")]
        public async Task<IActionResult> UpdateSAMedicine(int id, [FromBody] SAMedicineVm saMedicineVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateSAMedicineResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Medicine Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<SAMedicine>(saMedicineVm);
                var vMedicine = await _saMedicineService.GetByIdAsync(id);
                if (vMedicine == null)
                {
                    var res = new UpdateSAMedicineResponse()
                    {
                        Success = false,
                        Data = new UpdateSAMedicineData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }

                vMedicine.MedicineName = model.MedicineName ?? vMedicine.MedicineName;
                vMedicine.Notes = model.Notes ?? vMedicine.Notes;
                vMedicine.UsedFor = model.UsedFor ?? vMedicine.UsedFor;
                vMedicine.Formulation = model.Formulation ?? model.Formulation;
                vMedicine.ModifiedBy = _userName;
                vMedicine.DateModified = DateTime.Now;
                var result = await _saMedicineService.UpdateSAMedicineAsync(vMedicine);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateSAMedicineResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Medicine Identifier request." }
            });
        }

        [HttpGet]
        [Route("available-samedicine")]
        public async Task<IActionResult> GetAvailableSAMedicines(string medicineName)
        {
            if (string.IsNullOrEmpty(medicineName))
            {
                return BadRequest(new GetAvailableSAMedicineResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Medicine is required." }
                });
            }
            
            var result = await _saMedicineService.AvailableSAMedicinesAsync(false, medicineName);
            if (result != null && result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
