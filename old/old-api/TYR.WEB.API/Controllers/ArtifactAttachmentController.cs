using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AttachmentViewModel;
using TYR.WEB.Models.Response.AttachmentResult;
using TYR.WEB.Models.Constants;
using Microsoft.Extensions.Configuration;
//using Microsoft.WindowsAzure.Storage;
//using Microsoft.WindowsAzure.Storage.Blob;
//using Microsoft.Azure.Storage;
//using Microsoft.Azure.Storage.Blob;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using LazZiya.ImageResize;
using System.Drawing;
using Microsoft.AspNetCore.Hosting;

namespace TYR.WEB.API.Controllers
{
    [Route("api/artifact-attachment")]
    [ApiController]
    public class ArtifactAttachmentController : ControllerBase
    {
        private readonly IArtifactAttachmentService _artifactAttachmentService;
        private readonly IAnimalService _animalService;
        private readonly IPCOService _ipcoService;
        private readonly string _userName;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment _env;
        public ArtifactAttachmentController(IArtifactAttachmentService artifactAttachmentService, 
            IAnimalService animalService,
            IPCOService ipcoService,
            IUserService userService, 
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper,
            IConfiguration configuration, IWebHostEnvironment env)
        {
            _artifactAttachmentService = artifactAttachmentService;
            _animalService = animalService;
            _ipcoService = ipcoService;
            _userService = userService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _configuration = configuration;
            _httpContextAccessor= httpContextAccessor;
            _env = env;
        }

        [HttpPost]
        [Route("create-artifactattachment")]
        public async Task<IActionResult> AddArtifactAttachment([FromForm] AddAttachmentVm attachment)
        {
            string imageName = string.Empty;
           
            GetAttachmentResponse getAttachmentResponse = new();
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<ArtifactAttachment>(attachment);
                if (model.Entity.ToLower() == AttachmentEntity.ANIMAL.ToLower())
                    model.Entity = AttachmentEntity.ANIMAL;
                if (model.Entity.ToLower() == AttachmentEntity.PCO.ToLower())
                    model.Entity = AttachmentEntity.PCO;
                if (model.Entity.ToLower() == AttachmentEntity.TENANT.ToLower())
                    model.Entity = AttachmentEntity.TENANT;

                if (model.AttachmentType.ToLower() == AttachmentType.DOCUMENT.ToLower())
                    model.AttachmentType = AttachmentType.DOCUMENT;
                if (model.AttachmentType.ToLower() == AttachmentType.PHOTO.ToLower())
                    model.AttachmentType = AttachmentType.PHOTO;
                if (model.AttachmentType.ToLower() == AttachmentType.VIDEO.ToLower())
                    model.AttachmentType = AttachmentType.VIDEO;

                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                if(!model.TenantId.HasValue) { model.TenantId = tenantId; }

                
               
                //CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_configuration["StorageConnectionString:AzureConnection"]);
                //// Create the blob client.
                //CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
                //// Retrieve a reference to a container.
                //CloudBlobContainer container = blobClient.GetContainerReference(_configuration["StorageConnectionString:BlobContainerName"]);


                //BlobFileName blobFileName = new BlobFileName();
                if (model.Entity == AttachmentEntity.ANIMAL)
                {
                    getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByAnimalIdAsync(model.AnimalId.Value, model.Entity, model.AttachmentType);
                    model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                    //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.AnimalId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                    imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.AnimalId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                    //blobFileName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.AnimalId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                    var animal = await _animalService.GetAnimalByIdAsync(Convert.ToInt32(model.AnimalId));
                    model.Animal = animal != null ? (string.IsNullOrEmpty(animal.AnimalName) ? string.Empty : animal.AnimalName) : string.Empty;
                    model.PcoId = model.PcoId.HasValue && model.PcoId > 0 ? model.PcoId : 1;
                }
                if (model.Entity == AttachmentEntity.PCO)
                {
                    getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByPCOIdAsync(model.PcoId.Value, model.Entity, model.AttachmentType);
                    model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                    //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.PcoId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                    imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.PcoId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                    //blobFileName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.PcoId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                    var pco = await _ipcoService.GetPCOById(Convert.ToInt32(model.PcoId));
                    var personName = string.Empty;
                    if (pco != null)
                    {
                        personName = (!string.IsNullOrEmpty(pco.FirstName) ? pco.FirstName : string.Empty) + (!string.IsNullOrEmpty(pco.LastName) ? pco.LastName : string.Empty);
                    }
                    model.Person = personName;
                    model.PcoId = model.PcoId.HasValue && model.PcoId > 0 ? model.PcoId : 1;
                }
                if (model.Entity == AttachmentEntity.TENANT)
                {
                    getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByTenantIdAsync(model.TenantId.Value, model.Entity, model.AttachmentType);
                    model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                    //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                    imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.TenantId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                    //blobFileName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.TenantId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                    model.PcoId = 0;
                }

                // Get a reference to a blob named "sample-file" in a container named "sample-container"
                //BlobClient blob = container.GetBlobClient(blobFileName.BlobName);
                //imageName = blobFileName.BlobName + "/" + blobFileName.FileName;
                // Get a reference to a container named "sample-container" and then create it
                BlobContainerClient container = new(_configuration["StorageConnectionString:AzureConnection"], _configuration["StorageConnectionString:BlobContainerName"]);
                await container.CreateIfNotExistsAsync();
                BlobClient blobClient = container.GetBlobClient(imageName);

                // Upload local file
                await using (var data = attachment.Imagefiles.OpenReadStream())
                {
                    await blobClient.UploadAsync(data, true);
                }

                //CloudBlockBlob blockBlob = container.GetBlockBlobReference(imageName);
                //await using (var data = attachment.Imagefiles.OpenReadStream())
                //{
                //    await blockBlob.UploadFromStreamAsync(data);
                //}

                model.BlobUrl = blobClient.Uri.AbsoluteUri;
                model.OriginalBlobUrl = blobClient.Uri.AbsoluteUri;
                model.ThumbnailBlobUrl = blobClient.Uri.AbsoluteUri;
                model.DateEntered = DateTime.Now;
                model.IsDeleted = false;
                model.EnteredBy = _userName;
                model.TenantId = model.TenantId;
                model.FileName = imageName;
                model.OriginalFileName = attachment.Imagefiles?.FileName;
                model.FileNameExtension = Path.GetExtension(attachment.Imagefiles.FileName);
               
                var response = await _artifactAttachmentService.AddAttachmentAsync(model);
                return Ok(response);
            }
            else
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Errors= new List<string> { "Oops! Something wrong adding attachment record, Invalid request." },
                    Success= false,
                    StatusCode=200
                });
            }
        }

        [HttpPost]
        [Route("create-multiple-artifactattachment")]
        public async Task<IActionResult> AddMultipleArtifactAttachment([FromForm] AddMulipleAttachmentVm attachment)
        {
            string imageName = string.Empty;
            GetAttachmentResponse getAttachmentResponse = new();
            if (ModelState.IsValid)
            {
                foreach (var item in attachment.ListAnimalId)
                {
                    var model = _mapper.Map<ArtifactAttachment>(attachment);
                    model.AnimalId = item;
                    if (model.Entity.ToLower() == AttachmentEntity.ANIMAL.ToLower())
                        model.Entity = AttachmentEntity.ANIMAL;
                    if (model.Entity.ToLower() == AttachmentEntity.PCO.ToLower())
                        model.Entity = AttachmentEntity.PCO;
                    if (model.Entity.ToLower() == AttachmentEntity.TENANT.ToLower())
                        model.Entity = AttachmentEntity.TENANT;

                    if (model.AttachmentType.ToLower() == AttachmentType.DOCUMENT.ToLower())
                        model.AttachmentType = AttachmentType.DOCUMENT;
                    if (model.AttachmentType.ToLower() == AttachmentType.PHOTO.ToLower())
                        model.AttachmentType = AttachmentType.PHOTO;
                    if (model.AttachmentType.ToLower() == AttachmentType.VIDEO.ToLower())
                        model.AttachmentType = AttachmentType.VIDEO;


                    //CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_configuration["StorageConnectionString:AzureConnection"]);
                    //// Create the blob client.
                    //CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
                    //// Retrieve a reference to a container.
                    //CloudBlobContainer container = blobClient.GetContainerReference(_configuration["StorageConnectionString:BlobContainerName"]);

                    

                    if (model.Entity == AttachmentEntity.ANIMAL)
                    {
                        getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByAnimalIdAsync(model.AnimalId.Value, model.Entity, model.AttachmentType);
                        model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                        //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.AnimalId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                        imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.AnimalId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                        var animal = await _animalService.GetAnimalByIdAsync(Convert.ToInt32(model.AnimalId));
                        model.Animal = animal != null ? (string.IsNullOrEmpty(animal.AnimalName) ? string.Empty : animal.AnimalName) : string.Empty;
                        model.PcoId = model.PcoId.HasValue && model.PcoId > 0 ? model.PcoId : 1;
                    }
                    if (model.Entity == AttachmentEntity.PCO)
                    {
                        getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByPCOIdAsync(model.PcoId.Value, model.Entity, model.AttachmentType);
                        model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                        //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.PcoId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                        imageName =  _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.PcoId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                        var pco = await _ipcoService.GetPCOById(Convert.ToInt32(model.PcoId));
                        var personName = string.Empty;
                        if (pco != null)
                        {
                            personName = (!string.IsNullOrEmpty(pco.FirstName) ? pco.FirstName : string.Empty) + (!string.IsNullOrEmpty(pco.LastName) ? pco.LastName : string.Empty);
                        }
                        model.Person = personName;
                        model.PcoId = model.PcoId.HasValue && model.PcoId > 0 ? model.PcoId : 1;
                    }
                    if (model.Entity == AttachmentEntity.TENANT)
                    {
                        getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByTenantIdAsync(model.TenantId.Value, model.Entity, model.AttachmentType);
                        model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                        //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                        imageName =  _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.TenantId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                        model.PcoId = 0;
                    }

                    //CloudBlockBlob blockBlob = container.GetBlockBlobReference(imageName);

                    //await using (var data = attachment.Imagefiles.OpenReadStream())
                    //{
                    //    await blockBlob.UploadFromStreamAsync(data);
                    //}
                    BlobContainerClient container = new(_configuration["StorageConnectionString:AzureConnection"], _configuration["StorageConnectionString:BlobContainerName"]);
                    await container.CreateIfNotExistsAsync();
                    BlobClient blobClient = container.GetBlobClient(imageName);

                    await using (var data = attachment.Imagefiles.OpenReadStream())
                    {
                        await blobClient.UploadAsync(data, true);
                    }

                    model.BlobUrl = blobClient.Uri.AbsoluteUri;
                    model.OriginalBlobUrl = blobClient.Uri.AbsoluteUri;
                    model.ThumbnailBlobUrl = blobClient.Uri.AbsoluteUri;
                    model.DateEntered = DateTime.Now;
                    model.IsDeleted = false;
                    model.EnteredBy = _userName;
                    model.TenantId = model.TenantId;
                    model.OriginalFileName = attachment.Imagefiles?.FileName;
                    model.FileName = imageName;
                    model.FileNameExtension = Path.GetExtension(attachment.Imagefiles.FileName);

                    var response = await _artifactAttachmentService.AddAttachmentAsync(model);
                }


                return Ok(new GetAllAttachmentResponse
                {
                    Message = "Attachments uploaded successfully",
                    Success = false,
                    StatusCode = 200
                });
            }
            else
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong adding attachment record, Invalid request." },
                    Success = false,
                    StatusCode = 200
                });
            }
        }



        [HttpGet]
        [Route("get-artifactattachment-tenant/{tenantId}")]
        public async Task<IActionResult> GetArtifactByTenant(int tenantId, bool isDeleted)
        {
            if (tenantId <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Tenant identifier must be greater than 0" },
                    StatusCode=200
                });
            }
            return Ok(await _artifactAttachmentService.GetAllAttachmentAsync(isDeleted, tenantId));
        }

        [HttpGet]
        [Route("get-artifactattachment-id/{id}")]
        public async Task<IActionResult> GetArtifactById(int id, bool isDeleted, int tenantId)
        {
            if (tenantId <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Tenant identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Attachment identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            return Ok(await _artifactAttachmentService.GetAttachmentAsync(id, isDeleted, tenantId));
        }

        [HttpPut]
        [Route("update-artifactattachment/{id}")]
        public async Task<IActionResult> UpdateArtifactAttachment(int id, [FromForm] AddAttachmentVm attachment)
        {
            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new() { "Attachment identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            if (ModelState.IsValid)
            {
                string imageName = string.Empty;
                GetAttachmentResponse getAttachmentResponse = new();
                var model = _mapper.Map<ArtifactAttachment>(attachment);
                var artifact = await _artifactAttachmentService.GetArtifactById(id);

                if (artifact == null)
                {
                    var res = new UpdateAttachmentResponse()
                    {
                        Success = false,
                        Data = new UpdateAttachmentData { Id = id },
                        Errors = new List<string> { "No Attachment found" },
                        StatusCode = 200
                    };
                    return Ok(res);
                }

                artifact.AnimalId = model.AnimalId.HasValue && model.AnimalId.Value > 0 ? model.AnimalId.Value : artifact.AnimalId;
                artifact.AttachmentDate = model.AttachmentDate;

                if (model.Entity == AttachmentEntity.ANIMAL)
                {
                    if (attachment.Imagefiles != null)
                    {
                        getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByAnimalIdAsync(model.AnimalId.Value, model.Entity, model.AttachmentType);
                        model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                        //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.AnimalId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                        imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.AnimalId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                        artifact.SequenceNo = model.SequenceNo;
                    }

                    var animal = await _animalService.GetAnimalByIdAsync(Convert.ToInt32(model.AnimalId));
                    model.Animal = animal != null ? (string.IsNullOrEmpty(animal.AnimalName) ? string.Empty : animal.AnimalName) : string.Empty;
                }
                if (model.Entity == AttachmentEntity.PCO)
                {
                    if (attachment.Imagefiles != null)
                    {
                        getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByPCOIdAsync(model.PcoId.Value, model.Entity, model.AttachmentType);
                        model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                        //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.PcoId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                        imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.PcoId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                        artifact.SequenceNo = model.SequenceNo;
                    }

                    var pco = await _ipcoService.GetPCOById(Convert.ToInt32(model.PcoId));
                    var personName = string.Empty;
                    if (pco != null)
                    {
                        personName = (!string.IsNullOrEmpty(pco.FirstName) ? pco.FirstName : string.Empty) + (!string.IsNullOrEmpty(pco.LastName) ? pco.LastName : string.Empty);
                    }
                    model.Person = personName;
                }
                if (model.Entity == AttachmentEntity.TENANT)
                {
                    if (attachment.Imagefiles != null)
                    {
                        getAttachmentResponse = await _artifactAttachmentService.GetAttachmentSequenceByTenantIdAsync(model.TenantId.Value, model.Entity, model.AttachmentType);
                        model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment != null ? model.SequenceNo = getAttachmentResponse.Data.ArtifactAttachment.SequenceNo + 1 : model.SequenceNo = 1;
                        //imageName = await _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.SequenceNo, Path.GetExtension(attachment.Imagefiles.FileName));
                        imageName = _artifactAttachmentService.GetFileName(model.Entity, model.AttachmentType, model.TenantId.Value, model.TenantId.Value, model.SequenceNo, attachment.Imagefiles.FileName);
                        artifact.SequenceNo = model.SequenceNo;
                    }
                }

                if (attachment.Imagefiles != null)
                {
                    BlobContainerClient container = new(_configuration["StorageConnectionString:AzureConnection"], _configuration["StorageConnectionString:BlobContainerName"]);
                    await container.CreateIfNotExistsAsync();
                    BlobClient blobClient = container.GetBlobClient(imageName);

                    await using (var data = attachment.Imagefiles.OpenReadStream())
                    {
                        await blobClient.UploadAsync(data, true);
                    }

                    artifact.OriginalFileName = attachment.Imagefiles?.FileName;
                    artifact.FileName = imageName;
                    artifact.BlobUrl = blobClient.Uri.AbsoluteUri;
                    artifact.FileNameExtension = Path.GetExtension(attachment.Imagefiles.FileName);
                }

                artifact.DateModified = DateTime.Now;
                artifact.ModifiedBy = _userName;
                artifact.Notes = model.Notes;
                artifact.PcoId = model.PcoId ?? 0;
                artifact.PublicityRank = model.PublicityRank;
                artifact.TenantId = model.TenantId;
                artifact.Description = model.Description;

                var result = await _artifactAttachmentService.UpdateAttachmentAsync(artifact);
                return Ok(result);
            }
            else
            {
                return Ok(new UpdateAttachmentResponse
                {
                    Errors = new List<string> { "Invalid attachment request" },
                    StatusCode = 200,
                    Success = false
                });
            }
        }


        [HttpGet]
        [Route("get-artifactattachment-byanimal/{id}")]
        public async Task<IActionResult> GetArtifactByAnimalId(int id)
        {
            
            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            return Ok(await _artifactAttachmentService.GetAttachmentByAnimalIdAsync(id));
        }

        [HttpGet]
        [Route("get-artifactattachment-bypco/{id}")]
        public async Task<IActionResult> GetArtifactByPcoId(int id)
        {

            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "PCO identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            return Ok(await _artifactAttachmentService.GetAttachmentByPCOIdAsync(id));
        }


        [HttpPatch]
        [Route("delete-artifactattachment/{id}")]
        public async Task<IActionResult> DeleteArtifactById(int id)
        {
            if (id <= 0)
            {
                return Ok(new DeleteAttachmentResponse
                {
                    Errors = new List<string> { "Artifact identifier must be greater than 0" },
                    StatusCode = 200,
                    Success = false
                });
            }
            //CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_configuration["StorageConnectionString:AzureConnection"]);
            //// Create the blob client.
            //CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
            //// Retrieve a reference to a container.
            //CloudBlobContainer container = blobClient.GetContainerReference(_configuration["StorageConnectionString:BlobContainerName"]);


            var attachment = await _artifactAttachmentService.GetArtifactById(id);

            BlobContainerClient container = new(_configuration["StorageConnectionString:AzureConnection"], _configuration["StorageConnectionString:BlobContainerName"]);
            //await container.CreateIfNotExistsAsync();
            BlobClient blobClient = container.GetBlobClient(attachment.FileName);

            //var blob = container.GetBlobReference(attachment.FileName);
            await blobClient.DeleteIfExistsAsync();
            return Ok(await _artifactAttachmentService.UpdateAttachmentByDeletedAsync(id, true));

        }

        [HttpGet]
        [Route("get-allartifact-by-animalid/{id}")]
        public async Task<IActionResult> GetAllArtifactByAnimalId(int id, int tenantId)
        {
            if (tenantId <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Tenant identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Animal identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            return Ok(await _artifactAttachmentService.GetAllAttachmentByAnimalIdAsync(id, tenantId));
        }

        [HttpGet]
        [Route("get-allartifact-by-pcoid/{id}")]
        public async Task<IActionResult> GetAllArtifactByPcoId(int id, int tenantId)
        {
            if (tenantId <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Tenant identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "PCO identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            return Ok(await _artifactAttachmentService.GetAllAttachmentByPCOIdAsync(id, tenantId));
        }

        [HttpGet]
        [Route("get-allartifact-by-tenantid/{id}")]
        public async Task<IActionResult> GetAllArtifactByTenantId(int id)
        {
            if (id <= 0)
            {
                return Ok(new GetAllAttachmentResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Tenant identifier must be greater than 0" },
                    StatusCode = 200
                });
            }
            
            return Ok(await _artifactAttachmentService.GetAllAttachmentByTenantIdAsync(id));
        }

        [HttpGet]
        [Route("get-gallery/{id}")]
        public async Task<IActionResult> GetGalleryPhotos(bool? currentResident, int? id, bool? status)
        {
            var tenantId = await _userService.GetTenantIdByUserName(_userName);
            //status = status ?? false;
            return Ok(await _artifactAttachmentService.GetGalleryPhotosAsync(tenantId, currentResident, id, status, AttachmentEntity.ANIMAL, AttachmentType.PHOTO));
        }
    }
}
