using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalMilestoneResult;
using TYR.WEB.Models.Response.AnimalResult;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/animal-milestone")]
    [ApiController]
    public class AnimalMilestoneController : ControllerBase
    {
        private readonly IAnimalMilestoneService _animalMilestoneService;
        private readonly IAnimalService _animalService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        private readonly IPCOService _pcoService;
        public AnimalMilestoneController(IAnimalMilestoneService animalMilestoneService, 
                                         IAnimalService animalService, 
                                         IHttpContextAccessor httpContextAccessor, 
                                         IMapper mapper, 
                                         IUserService userService, 
                                         IPCOService pcoService)
        {
            _animalMilestoneService = animalMilestoneService;
            _animalService = animalService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
            _pcoService = pcoService;
        }

        [HttpPost]
        [Route("create-animal-milestone")]
        public async Task<IActionResult> AddAnimalMilestone([FromBody] AnimalMilestoneVm animalMilestoneVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<AnimalMilestone>(animalMilestoneVm);

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                model.DateEntered = DateTime.Now;
                model.IsDeleted = false;
                model.EnteredBy = _userName;
                model.TenantId = tenantId;
                
                var response = await _animalMilestoneService.AddAnimalMilestoneAsync(model);
                if (response.Success) return Ok(response);
                return BadRequest(response);
            }

            return BadRequest(new AddAnimalMilestoneResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Animal Milestone request."
                    }
            });
        }

        [HttpGet]
        [Route("get-animal-milestone")]
        public async Task<IActionResult> GetAllActiveAnimalMilestones(int limit, int page)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _animalMilestoneService.GetAllAnimalMilestonesAsync(false, tenantId));
        }

        [HttpPatch]
        [Route("delete-animal-milestone/{id}")]
        public async Task<IActionResult> DeleteAnimalMilestone(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new DeleteAnimalMilestoneResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal milestone identifier must be greater than 0" }
                });
            }

            var result = await _animalMilestoneService.UpdateAnimalMilestoneByDeletedAsync(id, true);
            if (result.Success)
            {
                // Once Animal Milestone Deleted then need to update Animal table with LastMilestoneDate and LastMilestone updated with last Milestone from AnimalMilestone Table based on DateCreated
                var vAnimalMilestone  = await _animalMilestoneService.GetByIdAsync(id);
                if(vAnimalMilestone != null)
                {
                    var milestone = await _animalMilestoneService.GetLastMilestoneByAnimalIdAsync(vAnimalMilestone.AnimalId.Value);
                    if (milestone != null)
                    {
                        var vAnimal = await _animalService.GetAnimalByIdAsync(vAnimalMilestone.AnimalId.Value);
                        if(milestone.PcoId.HasValue && milestone.PcoId.Value > 1) vAnimal.PcoId = milestone.PcoId.Value;
                        // Getting First Name and Last Name
                        var vPco = milestone.PcoId.HasValue && milestone.PcoId.Value > 1 ? await _pcoService.GetPCOById(milestone.PcoId.Value) : null;
                        string personLastName = vPco != null && !string.IsNullOrEmpty(vPco.LastName) ? vPco.LastName : string.Empty;
                        string personFirstName = vPco != null && !string.IsNullOrEmpty(vPco.FirstName) ? vPco.FirstName : string.Empty;
                        string personName = string.Empty;
                        if (!string.IsNullOrEmpty(personLastName))
                        {
                            personName = personLastName;
                            if (!string.IsNullOrEmpty(personFirstName)) { personName = personName + ", " + personFirstName; }
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(personFirstName)) { personName = personFirstName; }
                        }

                        if (milestone.MilestoneType.ToLower().Equals(MilestoneType.AdoptionMilestoneValue.ToLower()))  // Adoption Milestone
                        {
                            vAnimal.CurrentResident = false; vAnimal.Location = personName;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.AdoptionReturnMilestoneValue.ToLower()))  // Adoption Return Milestone
                        {
                            vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.FosterMilestoneValue.ToLower())) // Foster Milestone
                        {
                            vAnimal.CurrentResident = true; vAnimal.Location = personName;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.FosterReturnMilestoneValue.ToLower())) // Foster Return Milestone
                        {
                            vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.LostMilestoneValue.ToLower())) // Lost Milestone
                        {
                            vAnimal.CurrentResident = false; vAnimal.Location = string.Empty;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.FoundMilestoneValue.ToLower())) // Found Milestone
                        {
                            vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.ReleasedMilestoneValue.ToLower())) // Released Milestone
                        {
                            vAnimal.CurrentResident = false; vAnimal.Location = string.Empty;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.DeathMilestoneValue.ToLower())) // Death Milestone
                        {
                            vAnimal.CurrentResident = false; vAnimal.Location = CommonConstant.HEAVEN;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.ReturnedToOwnerMilestoneValue.ToLower())) // Returned to Owner
                        {
                            vAnimal.CurrentResident = false;                            // m_location = last and first name of owner
                            vAnimal.Location = personName;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.ReIntakeMilestoneValue.ToLower())) // ReIntake Milestone
                        {
                            vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                        }
                        else if (milestone.MilestoneType.ToLower().Equals(MilestoneType.TransferMilestoneValue.ToLower())) // Transfer Milestone
                        {
                            vAnimal.CurrentResident = false; vAnimal.Location = personName; // name of other rescue that the animal was transferred to
                        }
                        else if(milestone.MilestoneType.ToLower().Equals(MilestoneType.IntakeMilestoneValue.ToLower())) // Intake Milestone
                        {
                            vAnimal.CurrentResident = true; vAnimal.Location = personName;
                            if (string.IsNullOrEmpty(vAnimal.Location)) vAnimal.Location = milestone.AcquisitionWayName;
                        }


                        // Update LastMilestone and LastMilestoneDate into Animal Table
                        vAnimal.LastMilestone = milestone.MilestoneType;
                        vAnimal.LastMilestoneDate = milestone.MilestoneDate;
                        var animalResult = await _animalService.UpdateAnimalAsync(vAnimal, vAnimalMilestone.AnimalId.Value, _userName);
                        if (animalResult.Success) { }
                    }
                }
                
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost]
        [Route("update-animal-milestone/{id}")]
        public async Task<IActionResult> UpdateAnimalMilestone(int id, [FromBody] AnimalMilestoneUpdateVm animalMilestoneVm)
        {
            if (id <= 0)
            {
                return BadRequest(new UpdateAnimalMilestoneResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal milestone identifier is required" }
                });
            }

            if (ModelState.IsValid)
            {
                var vAnimalMilestone = await _animalMilestoneService.GetByIdAsync(id);
                if (vAnimalMilestone == null)
                {
                    var res = new UpdateAnimalMilestoneResponse()
                    {
                        Success = false,
                        Data = new UpdateAnimalMilestoneData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    };
                    return Ok(res);
                }
    
                var model = _mapper.Map<AnimalMilestone>(animalMilestoneVm);
                vAnimalMilestone.MilestoneType = model.MilestoneType;
                vAnimalMilestone.MilestoneDate = model.MilestoneDate;
                vAnimalMilestone.IsApproxDOB = model.IsApproxDOB;
                vAnimalMilestone.OtherRescueIDNo = model.OtherRescueIDNo;
                vAnimalMilestone.AmountPaidFee = model.AmountPaidFee;
                vAnimalMilestone.AmountReceivedFee = model.AmountReceivedFee;
                vAnimalMilestone.Notes = model.Notes;
                vAnimalMilestone.DateModified = DateTime.Now;
                vAnimalMilestone.IsDeleted = false;
                vAnimalMilestone.ModifiedBy = _userName;
                vAnimalMilestone.AcquisitionWayName = model.AcquisitionWayName;
                vAnimalMilestone.AcquisitionWayId = model.AcquisitionWayId;
                //vAnimalMilestone.PcoId = model.PcoId == 0 ? vAnimalMilestone.PcoId : (model.PcoId == null ? 1 : model.PcoId);
                vAnimalMilestone.PcoId = model.PcoId == 0 ? 1 : (model.PcoId == null ? 1 : model.PcoId);
                vAnimalMilestone.OtherRescueShelterId = model.OtherRescueShelterId.HasValue && model.OtherRescueShelterId.Value > 0 ? model.OtherRescueShelterId : 0;
                var result = await _animalMilestoneService.UpdateAnimalMilestoneAsync(vAnimalMilestone);
                if (result.Success)
                {
                    // Getting last milestone based on AnimalId
                    var lastMilestone = await _animalMilestoneService.GetLastMilestoneByAnimalIdAsync(vAnimalMilestone.AnimalId.Value);
                    // Updating location on Animals table
                    // Getting First Name and Last Name
                    var vPco = vAnimalMilestone.PcoId.HasValue && vAnimalMilestone.PcoId.Value > 1 ? await _pcoService.GetPCOById(vAnimalMilestone.PcoId.Value) : null;
                    string personLastName = vPco != null && !string.IsNullOrEmpty(vPco.LastName) ? vPco.LastName : string.Empty;
                    string personFirstName = vPco != null && !string.IsNullOrEmpty(vPco.FirstName) ? vPco.FirstName : string.Empty;
                    string personName = string.Empty;
                    if (!string.IsNullOrEmpty(personLastName))
                    {
                        personName = personLastName;
                        if (!string.IsNullOrEmpty(personFirstName)) { personName = personName + ", " + personFirstName; }
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(personFirstName)) { personName = personFirstName; }
                    }
                    var vAnimal = await _animalService.GetAnimalByIdAsync(vAnimalMilestone.AnimalId.Value);
                    if (vAnimalMilestone.PcoId.HasValue && vAnimalMilestone.PcoId.Value > 1) vAnimal.PcoId = vAnimalMilestone.PcoId.Value;
                    vAnimal.Location = personName;
                    vAnimal.LastMilestone = lastMilestone?.MilestoneType;
                    vAnimal.LastMilestoneDate = lastMilestone?.MilestoneDate;
                    var animalResult = await _animalService.UpdateAnimalAsync(vAnimal, vAnimalMilestone.AnimalId.Value, _userName);
                    if (animalResult.Success) { }

                    return Ok(result);
                } 

                return BadRequest(result);
            }

            return BadRequest(new UpdateAnimalMilestoneResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Animal Milestone request."
                    }
            });
        }

        [HttpPost]
        [Route("add-animal-milestone-by-animalIds")]
        public async Task<IActionResult> AddAnimalMilestoneByAnimalIds([FromBody] AnimalIdsMilestoneVm animalIdsMilestoneVm)
        {
            if (animalIdsMilestoneVm == null)
            {
                return BadRequest(new AddAnimalMilestoneListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal Milestones required" }
                
                });
            }
            if (animalIdsMilestoneVm.Ids.Count() == 0)
            {
                return BadRequest(new AddAnimalMilestoneListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" }
                });
            }

            if (ModelState.IsValid)
            {
                var result = new AddAnimalMilestoneResponse();
                var resultList = new List<AddAnimalMilestoneResponse>();
                decimal amountFee = (decimal)0.0;
                if(animalIdsMilestoneVm.Ids.Count() > 0)
                {
                    if(animalIdsMilestoneVm.AnimalMilestoneVm != null && animalIdsMilestoneVm.AnimalMilestoneVm.AmountPaidFee.HasValue && animalIdsMilestoneVm.AnimalMilestoneVm.AmountPaidFee.Value > 0)
                    {
                        amountFee = Math.Round(animalIdsMilestoneVm.AnimalMilestoneVm.AmountPaidFee.Value / animalIdsMilestoneVm.Ids.Count, 2);
                    }
                }

                foreach (var iden in animalIdsMilestoneVm.Ids)
                {
                    int id = Convert.ToInt32(iden);
                    var vAnimal = await _animalService.GetAnimalByIdAsync(id);
                    if (vAnimal == null)
                    {
                        var res = new AddAnimalMilestoneListResponse()
                        {
                            Success = false,
                            Errors = new List<string> { "No animal record found" },
                            StatusCode = 400
                        };
                        return Ok(res);
                    }

                    var model = _mapper.Map<AnimalMilestone>(animalIdsMilestoneVm.AnimalMilestoneVm);

                    if (model.PcoId.HasValue && model.PcoId.Value > 1) vAnimal.PcoId = model.PcoId.Value;

                    var tenantId = await _userService.GetTenantIdByUserName(_userName);
                    
                    // Getting First Name and Last Name
                    var vPco = model.PcoId.HasValue && model.PcoId.Value > 1 ? await _pcoService.GetPCOById(model.PcoId.Value) : await _pcoService.GetPCOById(vAnimal.PcoId.Value);
                    string personLastName = vPco != null && !string.IsNullOrEmpty(vPco.LastName) ? vPco.LastName : string.Empty;
                    string personFirstName = vPco != null && !string.IsNullOrEmpty(vPco.FirstName) ? vPco.FirstName : string.Empty;
                    string personName = string.Empty;
                    if(!string.IsNullOrEmpty(personLastName))
                    {
                        personName = personLastName;
                        if(!string.IsNullOrEmpty(personFirstName)) { personName = personName + ", " + personFirstName; }
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(personFirstName)) { personName = personFirstName; }
                    }

                    if (model.MilestoneType.ToLower().Equals(MilestoneType.AdoptionMilestoneValue.ToLower()))  // Adoption Milestone
                    { 
                        vAnimal.CurrentResident = false; vAnimal.Location = personName; 
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.AdoptionReturnMilestoneValue.ToLower()))  // Adoption Return Milestone
                    {
                        vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE; 
                    }
                    else if (model.MilestoneType.ToLower().Equals(MilestoneType.FosterMilestoneValue.ToLower())) // Foster Milestone
                    {
                        vAnimal.CurrentResident = true; vAnimal.Location = personName;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.FosterReturnMilestoneValue.ToLower())) // Foster Return Milestone
                    {
                        vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.LostMilestoneValue.ToLower())) // Lost Milestone
                    {
                        vAnimal.CurrentResident = false; vAnimal.Location = string.Empty;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.FoundMilestoneValue.ToLower())) // Found Milestone
                    {
                        vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.ReleasedMilestoneValue.ToLower())) // Released Milestone
                    {
                        vAnimal.CurrentResident = false; vAnimal.Location= string.Empty;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.DeathMilestoneValue.ToLower())) // Death Milestone
                    {
                        vAnimal.CurrentResident = false; vAnimal.Location = CommonConstant.HEAVEN;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.ReturnedToOwnerMilestoneValue.ToLower())) // Returned to Owner
                    {
                        vAnimal.CurrentResident = false;
                        // m_location = last and first name of owner
                        vAnimal.Location = personName;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.ReIntakeMilestoneValue.ToLower())) // ReIntake Milestone
                    {
                        vAnimal.CurrentResident = true; vAnimal.Location = CommonConstant.AT_RESCUE;
                    }
                    else if(model.MilestoneType.ToLower().Equals(MilestoneType.TransferMilestoneValue.ToLower())) // Transfer Milestone
                    {
                        vAnimal.CurrentResident = false; vAnimal.Location = personName; // name of other rescue that the animal was transferred to
                    }

                    model.DateEntered = DateTime.Now;
                    model.IsDeleted = false;
                    model.EnteredBy = _userName;
                    model.TenantId = tenantId;
                    model.AnimalId = id;
                    model.PcoId = model.PcoId.HasValue ? (model.PcoId.Value.Equals(0) ? 1 : model.PcoId.Value) : 1;
                    model.AmountPaidFee = amountFee;
                    model.OtherRescueShelterId = model.OtherRescueShelterId.HasValue && model.OtherRescueShelterId > 0 ? model.OtherRescueShelterId : null;

                    result = await _animalMilestoneService.AddAnimalMilestoneAsync(model);
                    resultList.Add(result);
                    if (result.Success) 
                    {
                        vAnimal.LastMilestone = model.MilestoneType;
                        vAnimal.LastMilestoneDate = model.MilestoneDate;
                        var animalResult = await _animalService.UpdateAnimalAsync(vAnimal, id, _userName);
                        if(animalResult.Success.Equals(false))
                        {
                            // Delete added animal milestone if Animal Update has failed
                            await _animalMilestoneService.UpdateAnimalMilestoneByDeletedAsync(result.Data.Id, true);
                            
                            return BadRequest(new AddAnimalMilestoneListResponse
                            {
                                Success = false,
                                Errors = animalResult.Errors
                            });
                        }
                        continue;
                    } 
                    
                    return BadRequest(result);
                }
                return Ok(resultList);
            }

            return BadRequest(new AddAnimalMilestoneListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Animal Milestone request."
                    }
            });
        }
       
        [HttpGet]
        [Route("get-animal-milestone-animalid/{id}")]
        public async Task<IActionResult> GetAllActiveAnimalMilestones(int id, int limit , int page)
        {
            bool isDeleted = false;
            return Ok(await _animalMilestoneService.GetAnimalMilestoneByAnimalId( id, limit, page, isDeleted));
        }

        [HttpGet]
        [Route("get-animal-milestone-count/{animalid}")]
        public async Task<IActionResult> GetAnimalMileStone(int id)
        {
            var _animalMilestone = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(id);
            if (_animalMilestone != null)
            {
                return Ok(new AnimalMilestonesCountResponse
                {
                    Data = _animalMilestone.Data,
                    Message = _animalMilestone.Message,
                    Success = _animalMilestone.Success,
                    StatusCode = _animalMilestone.StatusCode
                });
            }
            else
            {
                return Ok(new AnimalDeleteConfirmationResponse
                {
                    Errors = new List<string> { "Record does not exist" },
                    StatusCode = 200,
                    Success = false

                });
            }
        }

        [HttpGet]
        [Route("get-pco-link-milestone-donation-volunteer")]
        public async Task<IActionResult> GetPcoLinkIntakeMilestoneVolunteerDonationAsync(int pcoId)
        {
            if(pcoId <= 0)
            {
                return BadRequest(new GetPcoLinkMilestoneVolunteerDonationResponse
                {
                    Success = false,
                    Errors = new List<string>() { "PCO identifier is required" }
                });
            }

            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var result = await _animalMilestoneService.GetPcoLinkIntakeMilestoneVolunteerDonationAsync(pcoId, tenantId);
            
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
