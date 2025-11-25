using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalResult;
using TYR.WEB.Models.Response.AnimalNameResult;
using TYR.WEB.Models.ViewModels.AnimalViewModel;
using TYR.WEB.Services.Interfaces;
using System.Globalization;
using TYR.WEB.Models.Response.AnimalMilestoneResult;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/animal")]
    [ApiController]
    public class AnimalController : ControllerBase
    {

        private readonly IAnimalService _animalService;
        private readonly IMapper _mapper;
        private readonly string _userName;
        private readonly IUserService _userService;
        private readonly IAnimalMilestoneService _animalMilestoneService;
        private readonly IAnimalNameService _animalNameService;
        private readonly IArtifactAttachmentService _artifactAttachmentService;
        private readonly IAnimalTypeService _animalTypeService;

        public record UrlQueryParameters(int Limit = 20, int Page = 1);
        public AnimalController(IAnimalService animalServices, 
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper,
            IUserService userService,
            IAnimalMilestoneService animalMilestoneService,
            IAnimalNameService animalNameService,
            IArtifactAttachmentService artifactAttachmentService,
            IAnimalTypeService animalTypeService)
        {
            _animalService = animalServices;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userService = userService;
            _animalMilestoneService = animalMilestoneService;
            _animalNameService = animalNameService;
            _artifactAttachmentService = artifactAttachmentService;
            _animalTypeService = animalTypeService;
        }

        [HttpPost]
        [Route("create-animal")]
        public async Task<IActionResult> AddAnimal([FromBody] AnimalVm animalVm, int noofAnimals, int male, int female, int unknown)
        {
            AddMultipleAnimalResponse addMultipleAnimalResponse = new();
            List<AddAnimalData> animalListData = new();
            addMultipleAnimalResponse.Data = new List<AnimalIds>();
            decimal amountPaid = 0;
            decimal amountRecceived = 0;
            if (ModelState.IsValid)
            {
                if (noofAnimals != (male + female + unknown))
                {
                    return BadRequest(new AddMultipleAnimalResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "Invalid animal request. Total no animals is invalid" },
                        StatusCode = 400
                    });
                }
                else
                {
                    if(animalVm == null || animalVm.animal == null || animalVm.animal.AnimalTypeId <=0)
                    {
                        return BadRequest(new AddMultipleAnimalResponse
                        {
                            Success = false,
                            StatusCode = 400,
                            Errors = new List<string>() { "Animal details are required including animal type." }
                        });
                    }

                    var animalType = await _animalTypeService.GetByIdAsync(animalVm.animal.AnimalTypeId);
                    if (noofAnimals > 1 && noofAnimals == (male + female + unknown))
                    {
                        int counter = 0;
                        if (animalVm.intakeMilestone.AmountPaidFee > 1) amountPaid = (decimal)animalVm.intakeMilestone.AmountPaidFee / noofAnimals;

                        if (animalVm.intakeMilestone.AmountReceivedFee > 1) amountRecceived = (decimal)animalVm.intakeMilestone.AmountReceivedFee / noofAnimals;

                        for (int m = 0; m < male; m++)
                        {
                            counter++;
                            var model = _mapper.Map<Animal>(animalVm.animal);
                            model.Sex = "Male";
                            model.AnimalName = model.AnimalName + "-" + counter;
                            model.EnteredBy = _userName;
                            var lastanimalid = await _animalService.GetLastAnimalIdAsync((int)model.TenantId);
                            model.AnimalId = lastanimalid + 1;
                           // model.AssignedAnimalId = string.IsNullOrEmpty(model.AssignedAnimalId.ToString()) ? 0 : model.AssignedAnimalId;
                            model.Notes = string.IsNullOrEmpty(model.Notes) ? string.Empty : model.Notes;
                            model.ModifiedBy = string.Empty;
                            model.DateEntered = DateTime.Now;
                            model.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;
                            model.AnimalTypeName = animalType.TypeName;
                            var maleResponse = await _animalService.AddAnimalAsync(model);
                            if(maleResponse.Success==false)
                            {
                                return BadRequest(new AddMultipleAnimalResponse
                                {
                                    Success = false,
                                    Errors = new List<string>() {
                                           maleResponse.Errors[0],maleResponse.Errors[1]
                                    },
                                    StatusCode = 400
                                });
                            }

                            var birthMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.birthMilestone); //  Birth_milstone_model
                            var inkakeMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.intakeMilestone); // InTake_milstone_model

                            birthMilestoneModel.MilestoneType = MilestoneType.BirthMilestoneValue;
                            birthMilestoneModel.MilestoneDate = birthMilestoneModel.MilestoneDate;
                            birthMilestoneModel.EnteredBy = _userName;
                            birthMilestoneModel.AnimalId = maleResponse.Data.Id;
                            birthMilestoneModel.DateEntered = DateTime.Now;
                            birthMilestoneModel.AmountReceivedFee = amountRecceived;
                            birthMilestoneModel.AmountPaidFee = amountPaid;
                            birthMilestoneModel.TenantId = model.TenantId;
                            //birthMilestoneModel.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;

                            inkakeMilestoneModel.MilestoneType = MilestoneType.IntakeMilestoneValue;
                            inkakeMilestoneModel.MilestoneDate = inkakeMilestoneModel.MilestoneDate;
                            inkakeMilestoneModel.EnteredBy = _userName;
                            inkakeMilestoneModel.DateEntered = DateTime.Now;
                            inkakeMilestoneModel.AnimalId = maleResponse.Data.Id;
                            inkakeMilestoneModel.AmountReceivedFee = amountRecceived;
                            inkakeMilestoneModel.AmountPaidFee = amountPaid;
                            inkakeMilestoneModel.TenantId = model.TenantId;
                            inkakeMilestoneModel.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;
                            model.LastMilestone= MilestoneType.IntakeMilestoneValue;
                            model.LastMilestoneDate = inkakeMilestoneModel.MilestoneDate;
                            await _animalService.UpdateAnimalAsync(model, model.Id, _userName);

                            try
                            {
                                var birthMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(birthMilestoneModel);
                                var intakeMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(inkakeMilestoneModel);
                                /**********/

                                List<ListAnimalResponse> listAnimalResponse = new();
                                foreach (var animalAnimalTypeVm in maleResponse.Data.AnimalAnimalTypeVms)
                                {
                                    var animalId = animalAnimalTypeVm.Id;
                                    var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.BirthMilestoneValue);
                                    var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.IntakeMilestoneValue);

                                    var animalMilestones = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(animalId);

                                    var artifactAttachment = await _artifactAttachmentService.GetAttachmentByAnimalIdAsync(animalId);
                                    var artifactAttachmentsCount = await _artifactAttachmentService.GetAttachmentCountByAnimalIdAsync(animalId);
                                    BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                                    IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                                    ListAnimalResponse animalResponseVm = new()
                                    {
                                        Id = animalAnimalTypeVm.Id,
                                        AnimalId = animalAnimalTypeVm.AnimalId,
                                        AnimalName = animalAnimalTypeVm.AnimalName,
                                        AnimalTypeId = animalAnimalTypeVm.AnimalTypeId,
                                        CurrentResident = animalAnimalTypeVm.CurrentResident,
                                        Breed = animalAnimalTypeVm.Breed,
                                        Color = animalAnimalTypeVm.Color,
                                        Notes = animalAnimalTypeVm.Notes,
                                        Flag = animalAnimalTypeVm.Flag,
                                        FlagReason = animalAnimalTypeVm.FlagReason,
                                        IsDeleted = animalAnimalTypeVm.IsDeleted,
                                        Location = animalAnimalTypeVm.Location,
                                        // OtherIDNo = animalAnimalTypeVm.OtherIDNo,
                                        PcoId = animalAnimalTypeVm.PcoId,
                                        Pco = animalAnimalTypeVm.Pco,
                                        Sex = animalAnimalTypeVm.Sex,
                                        SpayedOrNeutered = animalAnimalTypeVm.SpayedOrNeutered,
                                        LastMilestone = animalAnimalTypeVm.LastMilestone,
                                        AnimalMilestone = animalAnimalTypeVm.AnimalMilestone,
                                        LastMilestoneDate = animalAnimalTypeVm.LastMilestoneDate,
                                        TenantId = animalAnimalTypeVm.TenantId,
                                        AnimalType = animalAnimalTypeVm.AnimalType,
                                        ChronicCondition = animalAnimalTypeVm.ChronicCondition,
                                        Status = animalAnimalTypeVm.Status,
                                        BirthMilestone = _birthMilestoneVM,
                                        IntakeMilestone = _intakeMilestoneVM,
                                        ArtifactAttachment = (artifactAttachment?.Data?.ArtifactAttachment),
                                        AttachmentCountData = new Models.Response.AttachmentResult.GetAttachmentCountData
                                        {
                                            Count = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.Count : 0) : 0,
                                            ArtifactAttachments = (artifactAttachmentsCount?.Data?.ArtifactAttachments)
                                        },
                                        AnimalMilestoneCountData = new AnimalMilestoneCountData
                                        {
                                            Count = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.Count : 0) : 0,
                                            AnimalMilestones = (animalMilestones?.Data?.AnimalMilestones)
                                        }
                                    };
                                    listAnimalResponse.Add(animalResponseVm);
                                }

                                
                                AnimalIds animalIds = new()
                                {
                                    Id = maleResponse.Data.Id,
                                    Animal = maleResponse.Data.Animal,
                                    BirthMilestoneId = birthMilestoneAdded.Data.Id,
                                    BirthAnimalMilestone = birthMilestoneAdded.Data.AnimalMilestone,
                                    IntakeMilestoneId = intakeMilestoneAdded.Data.Id,
                                    IntakeAnimalMilestone = intakeMilestoneAdded.Data.AnimalMilestone,
                                    AnimalList = listAnimalResponse
                                };

                                addMultipleAnimalResponse.Data.Add(animalIds);

                                /********/
                            }
                            catch (Exception ex)
                            {
                                return BadRequest(new AddMultipleAnimalResponse
                                {
                                    Success = false,
                                    Errors = new List<string>() {"Oops! something went wrong while adding the milestone",
                                           ex.Message, ex.InnerException.ToString()
                                    },
                                    StatusCode = 400
                                });
                            }
                        }
                        for (int f = 0; f < female; f++)
                        {
                            counter++;
                            var model = _mapper.Map<Animal>(animalVm.animal);
                            model.Sex = "Female";
                            model.AnimalName = model.AnimalName + "-" + counter;
                            model.EnteredBy = _userName;
                            model.DateEntered = DateTime.Now;
                            model.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;
                            var lastanimalid = await _animalService.GetLastAnimalIdAsync((int)model.TenantId);
                            model.AnimalId = lastanimalid + 1;
                           // model.AssignedAnimalId = string.IsNullOrEmpty(model.AssignedAnimalId.ToString()) ? 0 : model.AssignedAnimalId;
                            model.Notes = string.IsNullOrEmpty(model.Notes) ? string.Empty : model.Notes;
                            model.AnimalTypeName = animalType.TypeName;
                            var femaleResponse = await _animalService.AddAnimalAsync(model);
                            var birthMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.birthMilestone);
                            var inkakeMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.intakeMilestone);

                            birthMilestoneModel.MilestoneType = MilestoneType.BirthMilestoneValue;
                            birthMilestoneModel.MilestoneDate = birthMilestoneModel.MilestoneDate;
                            birthMilestoneModel.EnteredBy = _userName;
                            birthMilestoneModel.DateEntered = DateTime.Now;
                            birthMilestoneModel.AnimalId = femaleResponse.Data.Id;
                            birthMilestoneModel.AmountReceivedFee = amountRecceived;
                            birthMilestoneModel.AmountPaidFee = amountPaid;
                            birthMilestoneModel.TenantId = model.TenantId;
                            //birthMilestoneModel.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;

                            inkakeMilestoneModel.MilestoneType = MilestoneType.IntakeMilestoneValue;
                            inkakeMilestoneModel.AnimalId = femaleResponse.Data.Id;
                            inkakeMilestoneModel.EnteredBy = _userName;
                            inkakeMilestoneModel.DateEntered = DateTime.Now;
                            inkakeMilestoneModel.AmountReceivedFee = amountRecceived;
                            inkakeMilestoneModel.AmountPaidFee = amountPaid;
                            inkakeMilestoneModel.TenantId = model.TenantId;
                            inkakeMilestoneModel.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;

                            model.LastMilestone = MilestoneType.IntakeMilestoneValue;
                            model.LastMilestoneDate = inkakeMilestoneModel.MilestoneDate;
                            await _animalService.UpdateAnimalAsync(model, model.Id, _userName);
                            try
                            {
                                var birthMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(birthMilestoneModel);
                                var intakeMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(inkakeMilestoneModel);
                                /**********/

                                List<ListAnimalResponse> listAnimalResponse = new();
                                foreach (var animalAnimalTypeVm in femaleResponse.Data.AnimalAnimalTypeVms)
                                {
                                    var animalId = animalAnimalTypeVm.Id;
                                    var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.BirthMilestoneValue);
                                    var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.IntakeMilestoneValue);

                                    var animalMilestones = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(animalId);

                                    var artifactAttachment = await _artifactAttachmentService.GetAttachmentByAnimalIdAsync(animalId);
                                    var artifactAttachmentsCount = await _artifactAttachmentService.GetAttachmentCountByAnimalIdAsync(animalId);
                                    BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                                    IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                                    ListAnimalResponse animalResponseVm = new()
                                    {
                                        Id = animalAnimalTypeVm.Id,
                                        AnimalId = animalAnimalTypeVm.AnimalId,
                                        AnimalName = animalAnimalTypeVm.AnimalName,
                                        AnimalTypeId = animalAnimalTypeVm.AnimalTypeId,
                                        CurrentResident = animalAnimalTypeVm.CurrentResident,
                                        Breed = animalAnimalTypeVm.Breed,
                                        Color = animalAnimalTypeVm.Color,
                                        Notes = animalAnimalTypeVm.Notes,
                                        Flag = animalAnimalTypeVm.Flag,
                                        FlagReason = animalAnimalTypeVm.FlagReason,
                                        IsDeleted = animalAnimalTypeVm.IsDeleted,
                                        Location = animalAnimalTypeVm.Location,
                                        //OtherIDNo = animalAnimalTypeVm.OtherIDNo,
                                        PcoId = animalAnimalTypeVm.PcoId,
                                        Pco = animalAnimalTypeVm.Pco,
                                        Sex = animalAnimalTypeVm.Sex,
                                        SpayedOrNeutered = animalAnimalTypeVm.SpayedOrNeutered,
                                        LastMilestone = animalAnimalTypeVm.LastMilestone,
                                        AnimalMilestone = animalAnimalTypeVm.AnimalMilestone,
                                        LastMilestoneDate = animalAnimalTypeVm.LastMilestoneDate,
                                        TenantId = animalAnimalTypeVm.TenantId,
                                        AnimalType = animalAnimalTypeVm.AnimalType,
                                        ChronicCondition = animalAnimalTypeVm.ChronicCondition,
                                        Status = animalAnimalTypeVm.Status,
                                        BirthMilestone = _birthMilestoneVM,
                                        IntakeMilestone = _intakeMilestoneVM,
                                        ArtifactAttachment = (artifactAttachment?.Data?.ArtifactAttachment),
                                        AttachmentCountData = new Models.Response.AttachmentResult.GetAttachmentCountData
                                        {
                                            Count = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.Count : 0) : 0,
                                            ArtifactAttachments = (artifactAttachmentsCount?.Data?.ArtifactAttachments)
                                        },
                                        AnimalMilestoneCountData = new AnimalMilestoneCountData
                                        {
                                            Count = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.Count : 0) : 0,
                                            AnimalMilestones = (animalMilestones?.Data?.AnimalMilestones)
                                        }
                                    };
                                    listAnimalResponse.Add(animalResponseVm);
                                }

                                AnimalIds animalIds = new()
                                {
                                    Id = femaleResponse.Data.Id,
                                    Animal = femaleResponse.Data.Animal,
                                    BirthMilestoneId = birthMilestoneAdded.Data.Id,
                                    BirthAnimalMilestone = birthMilestoneAdded.Data.AnimalMilestone,
                                    IntakeMilestoneId = intakeMilestoneAdded.Data.Id,
                                    IntakeAnimalMilestone = intakeMilestoneAdded.Data.AnimalMilestone,
                                    AnimalList = listAnimalResponse
                                };

                                addMultipleAnimalResponse.Data.Add(animalIds);
                            }
                            catch (Exception ex)
                            {
                                return BadRequest(new AddMultipleAnimalResponse
                                {
                                    Success = false,
                                    Errors = new List<string>() {"Oops! something went wrong while adding the milestone",
                                           ex.Message, ex.InnerException.ToString()
                                    },
                                    StatusCode = 400
                                });
                            }
                        }
                        for (int u = 0; u < unknown; u++)
                        {
                            counter++;
                            var model = _mapper.Map<Animal>(animalVm.animal);
                            model.Sex = "Unknown";
                            model.AnimalName = model.AnimalName + "-" + counter;
                            model.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;
                            model.EnteredBy = _userName;
                            model.DateEntered = DateTime.Now;
                            var lastanimalid = await _animalService.GetLastAnimalIdAsync((int)model.TenantId);
                            model.AnimalId = lastanimalid + 1;
                            //model.AssignedAnimalId = string.IsNullOrEmpty(model.AssignedAnimalId.ToString()) ? 0 : model.AssignedAnimalId;
                            model.Notes = string.IsNullOrEmpty(model.Notes) ? string.Empty : model.Notes;
                            model.AnimalTypeName = animalType.TypeName;
                            var unknownResponse = await _animalService.AddAnimalAsync(model);
                            var birthMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.birthMilestone);
                            var inkakeMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.intakeMilestone);

                            birthMilestoneModel.MilestoneType = MilestoneType.BirthMilestoneValue;
                            birthMilestoneModel.MilestoneDate = birthMilestoneModel.MilestoneDate;
                            birthMilestoneModel.EnteredBy = _userName;
                            birthMilestoneModel.DateEntered = DateTime.Now;
                            birthMilestoneModel.AnimalId = unknownResponse.Data.Id;
                            birthMilestoneModel.AmountReceivedFee = amountRecceived;
                            birthMilestoneModel.AmountPaidFee = amountPaid;
                            birthMilestoneModel.TenantId = model.TenantId;
                            //birthMilestoneModel.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;

                            inkakeMilestoneModel.MilestoneType = MilestoneType.IntakeMilestoneValue;
                            inkakeMilestoneModel.AnimalId = unknownResponse.Data.Id;
                            inkakeMilestoneModel.EnteredBy = _userName;
                            inkakeMilestoneModel.DateEntered = DateTime.Now;
                            inkakeMilestoneModel.AmountReceivedFee = amountRecceived;
                            inkakeMilestoneModel.AmountPaidFee = amountPaid;
                            inkakeMilestoneModel.TenantId = model.TenantId;
                            inkakeMilestoneModel.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;

                            model.LastMilestone = MilestoneType.IntakeMilestoneValue;
                            model.LastMilestoneDate = inkakeMilestoneModel.MilestoneDate;
                            await _animalService.UpdateAnimalAsync(model, model.Id, _userName);
                            try
                            {
                                var birthMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(birthMilestoneModel);
                                var intakeMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(inkakeMilestoneModel);

                                /**********/

                                List<ListAnimalResponse> listAnimalResponse = new();
                                foreach (var animalAnimalTypeVm in unknownResponse.Data.AnimalAnimalTypeVms)
                                {
                                    var animalId = animalAnimalTypeVm.Id;
                                    var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.BirthMilestoneValue);
                                    var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.IntakeMilestoneValue);

                                    var animalMilestones = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(animalId);

                                    var artifactAttachment = await _artifactAttachmentService.GetAttachmentByAnimalIdAsync(animalId);
                                    var artifactAttachmentsCount = await _artifactAttachmentService.GetAttachmentCountByAnimalIdAsync(animalId);
                                    BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                                    IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                                    ListAnimalResponse animalResponseVm = new()
                                    {
                                        Id = animalAnimalTypeVm.Id,
                                        AnimalId = animalAnimalTypeVm.AnimalId,
                                        AnimalName = animalAnimalTypeVm.AnimalName,
                                        AnimalTypeId = animalAnimalTypeVm.AnimalTypeId,
                                        CurrentResident = animalAnimalTypeVm.CurrentResident,
                                        Breed = animalAnimalTypeVm.Breed,
                                        Color = animalAnimalTypeVm.Color,
                                        Notes = animalAnimalTypeVm.Notes,
                                        Flag = animalAnimalTypeVm.Flag,
                                        FlagReason = animalAnimalTypeVm.FlagReason,
                                        IsDeleted = animalAnimalTypeVm.IsDeleted,
                                        Location = animalAnimalTypeVm.Location,
                                        //OtherIDNo = animalAnimalTypeVm.OtherIDNo,
                                        PcoId = animalAnimalTypeVm.PcoId,
                                        Pco = animalAnimalTypeVm.Pco,
                                        Sex = animalAnimalTypeVm.Sex,
                                        SpayedOrNeutered = animalAnimalTypeVm.SpayedOrNeutered,
                                        LastMilestone = animalAnimalTypeVm.LastMilestone,
                                        AnimalMilestone = animalAnimalTypeVm.AnimalMilestone,
                                        LastMilestoneDate = animalAnimalTypeVm.LastMilestoneDate,
                                        TenantId = animalAnimalTypeVm.TenantId,
                                        AnimalType = animalAnimalTypeVm.AnimalType,
                                        ChronicCondition = animalAnimalTypeVm.ChronicCondition,
                                        Status = animalAnimalTypeVm.Status,
                                        BirthMilestone = _birthMilestoneVM,
                                        IntakeMilestone = _intakeMilestoneVM,
                                        ArtifactAttachment = (artifactAttachment?.Data?.ArtifactAttachment),
                                        AttachmentCountData = new Models.Response.AttachmentResult.GetAttachmentCountData
                                        {
                                            Count = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.Count : 0) : 0,
                                            ArtifactAttachments = (artifactAttachmentsCount?.Data?.ArtifactAttachments)
                                        },
                                        AnimalMilestoneCountData = new AnimalMilestoneCountData
                                        {
                                            Count = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.Count : 0) : 0,
                                            AnimalMilestones = (animalMilestones?.Data?.AnimalMilestones)
                                        }
                                    };
                                    listAnimalResponse.Add(animalResponseVm);
                                }

                                AnimalIds animalIds = new()
                                {
                                    Id = unknownResponse.Data.Id,
                                    Animal = unknownResponse.Data.Animal,
                                    BirthMilestoneId = birthMilestoneAdded.Data.Id,
                                    BirthAnimalMilestone = birthMilestoneAdded.Data.AnimalMilestone,
                                    IntakeMilestoneId = intakeMilestoneAdded.Data.Id,
                                    IntakeAnimalMilestone = intakeMilestoneAdded.Data.AnimalMilestone,
                                    AnimalList = listAnimalResponse
                                };
                                addMultipleAnimalResponse.Data.Add(animalIds);
                            }
                            catch (Exception ex)
                            {
                                return BadRequest(new AddMultipleAnimalResponse
                                {
                                    Success = false,
                                    Errors = new List<string>() {"Oops! something went wrong while adding the milestone",
                                           ex.Message, ex.InnerException.ToString()
                                    },
                                    StatusCode = 400
                                });
                            }
                        }
                    }
                    else
                    {
                        var model = _mapper.Map<Animal>(animalVm.animal);
                        model.EnteredBy = _userName;
                        model.DateEntered = DateTime.Now;
                        var lastanimalid = await _animalService.GetLastAnimalIdAsync((int)model.TenantId);
                        model.AnimalId = lastanimalid + 1;
                        model.PcoId = animalVm.animal.PcoId == null ? 1 : animalVm.animal.PcoId;
                       // model.AssignedAnimalId = string.IsNullOrEmpty(model.AssignedAnimalId.ToString()) ? 0 : model.AssignedAnimalId;
                        if (model.LastMilestone != null && model.LastMilestone.ToLower() =="string") model.LastMilestone = string.Empty;
                        model.Notes = string.IsNullOrEmpty(model.Notes) ? string.Empty : model.Notes;
                        if (male == 1) model.Sex = "Male";
                        if (female == 1) model.Sex = "Female";
                        if (unknown == 1) model.Sex = "Unknown";

                        model.AnimalTypeName = animalType.TypeName;
                        var animalAdded = await _animalService.AddAnimalAsync(model);
                        var birthMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.birthMilestone);
                        var inkakeMilestoneModel = _mapper.Map<AnimalMilestone>(animalVm.intakeMilestone);

                        birthMilestoneModel.MilestoneType = MilestoneType.BirthMilestoneValue;
                        birthMilestoneModel.MilestoneDate = birthMilestoneModel.MilestoneDate;
                        birthMilestoneModel.EnteredBy = _userName;
                        birthMilestoneModel.AnimalId = animalAdded.Data.Id;
                        birthMilestoneModel.TenantId = model.TenantId;
                        birthMilestoneModel.DateEntered = DateTime.Now;

                        inkakeMilestoneModel.MilestoneType = MilestoneType.IntakeMilestoneValue;
                        inkakeMilestoneModel.MilestoneDate = inkakeMilestoneModel.MilestoneDate;
                        inkakeMilestoneModel.EnteredBy = _userName;
                        inkakeMilestoneModel.AnimalId = animalAdded.Data.Id;
                        inkakeMilestoneModel.TenantId = model.TenantId;
                        inkakeMilestoneModel.DateEntered = DateTime.Now;

                        var birthMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(birthMilestoneModel);
                        var intakeMilestoneAdded = await _animalMilestoneService.AddAnimalMilestoneAsync(inkakeMilestoneModel);

                        model.LastMilestone = MilestoneType.IntakeMilestoneValue;
                        model.LastMilestoneDate = inkakeMilestoneModel.MilestoneDate;
                        await _animalService.UpdateAnimalAsync(model, model.Id, _userName);
                        try
                        {
                            /**********/

                            List<ListAnimalResponse> listAnimalResponse = new();
                            foreach (var animalAnimalTypeVm in animalAdded.Data.AnimalAnimalTypeVms)
                            {
                                var animalId = animalAnimalTypeVm.Id;
                                var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.BirthMilestoneValue);
                                var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.IntakeMilestoneValue);

                                var animalMilestones = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(animalId);

                                var artifactAttachment = await _artifactAttachmentService.GetAttachmentByAnimalIdAsync(animalId);
                                var artifactAttachmentsCount = await _artifactAttachmentService.GetAttachmentCountByAnimalIdAsync(animalId);
                                BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                                IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                                ListAnimalResponse animalResponseVm = new()
                                {
                                    Id = animalAnimalTypeVm.Id,
                                    AnimalId = animalAnimalTypeVm.AnimalId,
                                    AnimalName = animalAnimalTypeVm.AnimalName,
                                    AnimalTypeId = animalAnimalTypeVm.AnimalTypeId,
                                    CurrentResident = animalAnimalTypeVm.CurrentResident,
                                    Breed = animalAnimalTypeVm.Breed,
                                    Color = animalAnimalTypeVm.Color,
                                    Notes = animalAnimalTypeVm.Notes,
                                    Flag = animalAnimalTypeVm.Flag,
                                    FlagReason = animalAnimalTypeVm.FlagReason,
                                    IsDeleted = animalAnimalTypeVm.IsDeleted,
                                    Location = animalAnimalTypeVm.Location,
                                    //OtherIDNo = animalAnimalTypeVm.OtherIDNo,
                                    PcoId = animalAnimalTypeVm.PcoId,
                                    Pco = animalAnimalTypeVm.Pco,
                                    Sex = animalAnimalTypeVm.Sex,
                                    SpayedOrNeutered = animalAnimalTypeVm.SpayedOrNeutered,
                                    LastMilestone = animalAnimalTypeVm.LastMilestone,
                                    AnimalMilestone = animalAnimalTypeVm.AnimalMilestone,
                                    LastMilestoneDate = animalAnimalTypeVm.LastMilestoneDate,
                                    TenantId = animalAnimalTypeVm.TenantId,
                                    AnimalType = animalAnimalTypeVm.AnimalType,
                                    ChronicCondition = animalAnimalTypeVm.ChronicCondition,
                                    Status = animalAnimalTypeVm.Status,
                                    BirthMilestone = _birthMilestoneVM,
                                    IntakeMilestone = _intakeMilestoneVM,
                                    ArtifactAttachment = (artifactAttachment?.Data?.ArtifactAttachment),
                                    AttachmentCountData = new Models.Response.AttachmentResult.GetAttachmentCountData
                                    {
                                        Count = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.Count : 0) : 0,
                                        ArtifactAttachments = (artifactAttachmentsCount?.Data?.ArtifactAttachments)
                                    },
                                    AnimalMilestoneCountData = new AnimalMilestoneCountData
                                    {
                                        Count = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.Count : 0) : 0,
                                        AnimalMilestones = (animalMilestones?.Data?.AnimalMilestones)
                                    }
                                };
                                listAnimalResponse.Add(animalResponseVm);
                            }

                            AnimalIds animalIds = new()
                            {
                                Id = animalAdded.Data.Id,
                                Animal = animalAdded.Data.Animal,
                                BirthMilestoneId = birthMilestoneAdded.Data.Id,
                                BirthAnimalMilestone = birthMilestoneAdded.Data.AnimalMilestone,
                                IntakeMilestoneId = intakeMilestoneAdded.Data.Id,
                                IntakeAnimalMilestone = intakeMilestoneAdded.Data.AnimalMilestone,
                                AnimalList = listAnimalResponse
                            };
                            addMultipleAnimalResponse.Data.Add(animalIds);

                        }
                        catch (Exception ex)
                        {
                            return BadRequest(new AddAnimalResponse
                            {
                                Success = false,
                                Errors = new List<string>() {"Oops! something went wrong while adding the milestone",
                                           ex.Message, ex.InnerException.ToString()
                                    },
                                StatusCode = 400
                            });
                        }
                    }
                    addMultipleAnimalResponse.Success = true;
                    addMultipleAnimalResponse.Message = "Animals Added Successfully!";
                    addMultipleAnimalResponse.StatusCode = 200;
                    return Ok(addMultipleAnimalResponse);
                }
            }
            else
            {
                return BadRequest(new AddMultipleAnimalResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                        "Invalid animal request."
                    },
                    StatusCode = 400
                });
            }

        }

        [HttpGet]
        [Route("get-animal")]
        public async Task<AnimalPagedResponse> GetAnimalList([FromQuery] UrlQueryParameters urlQueryParameters, string? searchText, bool isAvailable, bool isDeleted)
        {
           
            List<ListAnimalResponse> listanimalVms = new();

            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            var paginatedanimals = await _animalService.GetAnimalSearchFilterPagedAsync(tenantId, isDeleted, searchText, isAvailable, urlQueryParameters.Limit, urlQueryParameters.Page);

            foreach (var pagedAnimal in paginatedanimals.Data.Animals)
            {
                var animalId = pagedAnimal.Id;
                var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.BirthMilestoneValue);
                var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.IntakeMilestoneValue);

                var animalMilestones = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(animalId);

                var artifactAttachment = await _artifactAttachmentService.GetAttachmentTypeByAnimalIdAsync(animalId, AttachmentEntity.ANIMAL, AttachmentType.PHOTO);
                var artifactAttachmentsCount = await _artifactAttachmentService.GetAttachmentCountByAnimalIdAsync(animalId);
                BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                ListAnimalResponse animalResponseVm = new()
                {
                    Id = pagedAnimal.Id,
                    AnimalId = pagedAnimal.AnimalId,
                    //animalResponseVm.AssignedAnimalId = pagedAninal.AssignedAnimalId;
                    AnimalName = pagedAnimal.AnimalName,
                    AnimalTypeId = pagedAnimal.AnimalTypeId,
                    CurrentResident = pagedAnimal.CurrentResident,
                    Breed = pagedAnimal.Breed,
                    Color = pagedAnimal.Color,
                    Notes = pagedAnimal.Notes,
                    Flag = pagedAnimal.Flag,
                    FlagReason = pagedAnimal.FlagReason,
                    IsDeleted = pagedAnimal.IsDeleted,
                    Location = pagedAnimal.Location,
                    //OtherIDNo = pagedAnimal.OtherIDNo,
                    PcoId = pagedAnimal.PcoId,
                    Pco = pagedAnimal.Pco,
                    Sex = pagedAnimal.Sex,
                    SpayedOrNeutered = pagedAnimal.SpayedOrNeutered,
                    LastMilestone = pagedAnimal.LastMilestone,
                    AnimalMilestone = pagedAnimal.AnimalMilestone,
                    LastMilestoneDate = pagedAnimal.LastMilestoneDate,
                    TenantId = pagedAnimal.TenantId,
                    AnimalType = pagedAnimal.AnimalType,
                    ChronicCondition = pagedAnimal.ChronicCondition,
                    Status = pagedAnimal.Status,
                    BirthMilestone = _birthMilestoneVM,
                    IntakeMilestone = _intakeMilestoneVM,
                    ArtifactAttachment = (artifactAttachment?.Data?.ArtifactAttachment),
                    AttachmentCountData = new Models.Response.AttachmentResult.GetAttachmentCountData
                    {
                        Count = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.Count : 0) : 0,
                        ArtifactAttachments = (artifactAttachmentsCount?.Data?.ArtifactAttachments)
                    },
                    AnimalMilestoneCountData = new AnimalMilestoneCountData
                    {
                        Count = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.Count : 0) : 0,
                        AnimalMilestones = (animalMilestones?.Data?.AnimalMilestones)
                    }
                };
                listanimalVms.Add(animalResponseVm);
            }
            return new AnimalPagedResponse
            {
                Data = new AnimalPageData
                {
                    CurrentPage = paginatedanimals.Data.CurrentPage,
                    AnimalsList = listanimalVms,
                    TotalItems = paginatedanimals.Data.TotalItems,
                    TotalPage = paginatedanimals.Data.TotalPage,
                    NextPage = paginatedanimals.Data.NextPage,
                    PrevPage = paginatedanimals.Data.PrevPage
                },
                Message = "Animal Retrived successfully",
                StatusCode = 200,
                Success = true
            };
        }

        [HttpPut]
        [Route("Update-animal")]
        public async Task<IActionResult> UpdateAnimal([FromBody] UpdateAnimalVm animalVm, int Id)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<Animal>(animalVm);
                var animalType = await _animalTypeService.GetByIdAsync(animalVm.AnimalTypeId);
                model.AnimalTypeName = animalType != null ? animalType.TypeName : string.Empty;
                var updateAnimal = await _animalService.UpdateAnimalAsync(model, Id, _userName);
                var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(updateAnimal.Data.Id, MilestoneType.BirthMilestoneValue);
                var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(updateAnimal.Data.Id, MilestoneType.IntakeMilestoneValue);
                BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                updateAnimal.Data.Animal.IntakeMilestone = _intakeMilestoneVM;
                updateAnimal.Data.Animal.BirthMilestone= _birthMilestoneVM;
                return Ok(updateAnimal);
            }
            else
            {
                return Ok(new UpdateAnimalResponse
                {
                    Success = false,
                    Errors = new List<string> { "Invalid Animal Request" },
                });
            }
        }

        [HttpPatch]
        [Route("delete-animal/{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _animalService.GetAnimalByIdAsync(id);
            if (animal != null)
            {
                var animalId = animal.Id;
                var result = await _animalMilestoneService.DeleteMileStoneByAnimal(animalId);
                if(result)
                {
                    result = await _artifactAttachmentService.DeleteArtifactAttachmentByAnimalIdAsync(animalId);
                    if (result)
                    {
                        var deleteAnimalResponse = await _animalService.DeleteAnimalAsync(animalId, _userName);
                        if(deleteAnimalResponse.Success) return Ok(deleteAnimalResponse);
                        else
                        {
                            return BadRequest(deleteAnimalResponse);
                        }
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }
                else
                {
                    return BadRequest(result);
                }
            }
            else
            {
                return Ok(new DeleteAnimalResponse
                {
                    Errors = new List<string> { "Animal does not exist" },
                    StatusCode = 200,
                    Success = false
                });
            }
        }

        [HttpGet]
        [Route("get-animalname-suggestions")]
        public async Task<IActionResult> GetAnimalnameSuggestion(string gender)
        {
            var nameSuggestion  = await _animalNameService.GetAnimalNameSuggestion(gender);
            if (nameSuggestion != null)
            {
                return Ok(new AnimalNameSuggestionResponse
                {
                    Data = nameSuggestion,
                    Success = true,
                    Message = "Name suggested",
                    StatusCode = 200
                });
            }
            else
            {
                return Ok(new AnimalNameSuggestionResponse
                {
                    Errors = new List<string> { "Record does not exist" },
                    StatusCode = 200,
                    Success = false
                });
            } 
        }

        [HttpGet]
        [Route("auto-complete-animal-list")]
        public async Task<IActionResult> GetAutoCompleteAnimalList(string searchText, int limit)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            return Ok(await _animalService.AnimalSearchAutoCompleteAsync(tenantId, searchText, limit));
        }

        [HttpGet]
        [Route("get-animals-by-animalIds")]
        public async Task<IActionResult> GetAnimalListByIds([System.Web.Http.FromUri] string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest(new GetAnimalListResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" },
                    StatusCode = 400
                });
            }

            if (ModelState.IsValid)
            {
                var sIdents = ids.Split(',').ToList();
                var idents = new List<int>();
                foreach(string s in sIdents)
                {
                    idents.Add(int.Parse(s));
                }

                var animalListResponse = await _animalService.GetAnimalListByIdsAsync(idents);
                List<ListAnimalResponse> listAnimalResponse = new List<ListAnimalResponse>();
                foreach (var animalVm in animalListResponse.Data.AnimalAnimalTypeVms)
                {
                    var animalId = animalVm.Id;
                    var birthMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.BirthMilestoneValue);
                    var intakeMilestone = await _animalMilestoneService.GetAnimalMilestoneByAnimalIdAndType(animalId, MilestoneType.IntakeMilestoneValue);

                    var animalMilestones = await _animalMilestoneService.GetAnimalMilestoneCountByAnimalId(animalId);

                    var artifactAttachment = await _artifactAttachmentService.GetAttachmentTypeByAnimalIdAsync(animalId, AttachmentEntity.ANIMAL, AttachmentType.PHOTO);
                    var artifactAttachmentsCount = await _artifactAttachmentService.GetAttachmentCountByAnimalIdAsync(animalId);
                    BirthMilestoneVM _birthMilestoneVM = _mapper.Map<BirthMilestoneVM>(birthMilestone);
                    IntakeMilestoneVM _intakeMilestoneVM = _mapper.Map<IntakeMilestoneVM>(intakeMilestone);
                    ListAnimalResponse animalResponseVm = new()
                    {
                        Id = animalVm.Id,
                        AnimalId = animalVm.AnimalId,
                        AnimalName = animalVm.AnimalName,
                        AnimalTypeId = animalVm.AnimalTypeId,
                        CurrentResident = animalVm.CurrentResident,
                        Breed = animalVm.Breed,
                        Color = animalVm.Color,
                        Notes = animalVm.Notes,
                        Flag = animalVm.Flag,
                        FlagReason = animalVm.FlagReason,
                        IsDeleted = animalVm.IsDeleted,
                        Location = animalVm.Location,
                        //OtherIDNo = animalVm.OtherIDNo,
                        PcoId = animalVm.PcoId,
                        Pco = animalVm.Pco,
                        Sex = animalVm.Sex,
                        SpayedOrNeutered = animalVm.SpayedOrNeutered,
                        LastMilestone = animalVm.LastMilestone,
                        AnimalMilestone = animalVm.AnimalMilestone,
                        LastMilestoneDate = animalVm.LastMilestoneDate,
                        TenantId = animalVm.TenantId,
                        AnimalType = animalVm.AnimalType,
                        ChronicCondition = animalVm.ChronicCondition,
                        Status = animalVm.Status,
                        BirthMilestone = _birthMilestoneVM,
                        IntakeMilestone = _intakeMilestoneVM,
                        ArtifactAttachment = artifactAttachment != null ? (artifactAttachment.Data != null ? artifactAttachment.Data.ArtifactAttachment : null) : null,
                        AttachmentCountData = new Models.Response.AttachmentResult.GetAttachmentCountData
                        {
                            Count = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.Count : 0) : 0,
                            ArtifactAttachments = artifactAttachmentsCount != null ? (artifactAttachmentsCount.Data != null ? artifactAttachmentsCount.Data.ArtifactAttachments : null) : null
                        },
                        AnimalMilestoneCountData = new AnimalMilestoneCountData
                        {
                            Count = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.Count : 0) : 0,
                            AnimalMilestones = animalMilestones != null ? (animalMilestones.Data != null ? animalMilestones.Data.AnimalMilestones : null) : null
                        }
                    };
                    listAnimalResponse.Add(animalResponseVm);
                }

                return Ok(new GetAnimalListResponse
                {
                    Data = new GetAnimalListData { AnimalList = listAnimalResponse },
                    Message = "Animal retrieved successfully",
                    StatusCode = 200,
                    Success = true
                });
            }

            return BadRequest(new GetAnimalListResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid Animals request."
                    }
            });
        }

        [HttpPut]
        [Route("update-animal-location")]
        public async Task<IActionResult> UpdateAnimalLocationByAnimalId([System.Web.Http.FromUri] string ids, string location)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest(new UpdateAnimalLocationResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" },
                    StatusCode = 400
                });
            }

            if (ModelState.IsValid)
            {
                var sIdents = ids.Split(',').ToList();
                var idents = new List<int>();
                foreach (string s in sIdents)
                {
                    idents.Add(int.Parse(s));
                }

                var result = await _animalService.UpdateAnimalLocationAsync(idents, location);
                return Ok(result);
            }
            else
            {
                return BadRequest(new UpdateAnimalLocationResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Invalid request." }
                });
            }
        }

        [HttpPut]
        [Route("update-animal-publicity-blurb")]
        public async Task<IActionResult> UpdateAnimalPublicityBlurb(int animalId, string publicityBlurb)
        {
            if (animalId <= 0)
            {
                return BadRequest(new UpdateAnimalPublicityBlurbResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifier required" },
                    StatusCode = 400
                });
            }

            if (ModelState.IsValid)
            {
                var result = await _animalService.UpdateAnimalPublicityBlurbAsync(animalId, publicityBlurb);
                return Ok(result);
            }
            else
            {
                return BadRequest(new UpdateAnimalPublicityBlurbResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                        "Invalid request."
                    }
                });
            }
        }

        [HttpPut]
        [Route("update-animal-diet")]
        public async Task<IActionResult> UpdateAnimalDiet([System.Web.Http.FromUri] string ids, string diet)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest(new UpdateAnimalDietResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifiers required" },
                    StatusCode = 400
                });
            }

            if (ModelState.IsValid)
            {
                var sIdents = ids.Split(',').ToList();
                var idents = new List<int>();
                foreach (string s in sIdents)
                {
                    idents.Add(int.Parse(s));
                }

                var result = await _animalService.UpdateAnimalDietAsync(idents, diet);
                return Ok(result);
            }
            else
            {
                return BadRequest(new UpdateAnimalDietResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                        "Invalid request."
                    }
                });
            }
        }

        [HttpGet]
        [Route("get-animal-diet")]
        public async Task<IActionResult> GetAnimalDietById(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetAnimalDietResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var result = await _animalService.GetAnimalDietByIdAsync(animalId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-animal-publicity-blurb")]
        public async Task<IActionResult> GetAnimalPublicityBlurbByIdAsync(int animalId)
        {
            if (animalId <= 0)
            {
                return BadRequest(new GetAnimalPublicityBlurbResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                         "Animal identifier required."
                    }
                });
            }
            var result = await _animalService.GetAnimalPublicityBlurbByIdAsync(animalId);
            if (result != null && result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

    }
}
