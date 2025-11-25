using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Models.ViewModels.MedicineViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/medicine")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly IMedicineService _medicineService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        public MedicineController(IMedicineService medicineService, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserService userService)
        {
            _medicineService = medicineService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost]
        [Route("create-medicine")]
        public async Task<IActionResult> AddMedicine([FromBody] MedicineVm medicineVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Medicine>(medicineVm);

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var result = await _medicineService.AvailableMedicines(false, model.MedicineName, tenantId);
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
                var response = await _medicineService.AddMedicineAsync(model);
                if (response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new AddMedicineResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Medicine request." }
            });
        }

        [HttpGet]
        [Route("get-medicine")]
        public async Task<IActionResult> GetAllActiveMedicines()
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _medicineService.GetAllMedicinesAsync(false, tenantId));
        }

        [HttpPatch]
        [Route("delete-medicine/{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteMedicineResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Medicine Identifier must be greater than 0" }
                });
            }

            var result = await _medicineService.UpdateMedicineByDeletedAsync(id, true);
            if (result.Success) return Ok(result);

            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-medicine/{id}")]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] MedicineVm medicineVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateMedicineResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Medicine Identifier must be greater than 0" }
                });
            }

            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Medicine>(medicineVm);
                var vMedicine = await _medicineService.GetByIdAsync(id);
                if (vMedicine == null)
                {
                    var res = new UpdateMedicineResponse()
                    {
                        Success = false,
                        Data = new UpdateMedicineData { Id = id },
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
                var result = await _medicineService.UpdateMedicine(vMedicine);
                if (result.Success) return Ok(result);

                return BadRequest(result);
            }

            return BadRequest(new UpdateMedicineResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Medicine Identifier request." }
            });
        }

        [HttpGet]
        [Route("available-medicine")]
        public async Task<IActionResult> GetAvailableMedicines(string medicineName)
        {
            if (string.IsNullOrEmpty(medicineName))
            {
                return BadRequest(new GetAvailableMedicineResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Medicine is required." }
                });
            }
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _medicineService.AvailableMedicines(false, medicineName, tenantId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
