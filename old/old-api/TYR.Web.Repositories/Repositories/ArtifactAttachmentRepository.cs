using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AttachmentResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class ArtifactAttachmentRepository : RepositoryBase<ArtifactAttachment>, IArtifactAttachmentRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly IAnimalRepository _animalRepository;
        private readonly IAnimalTypeRepository _animalTypeRepository;
        public ArtifactAttachmentRepository(TYRDbContext dbContext, IAnimalRepository animalRepository, IAnimalTypeRepository animalTypeRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _animalRepository = animalRepository;
            _animalTypeRepository = animalTypeRepository;
        }
        public async Task<AddAttachmentResponse> AddAttachmentAsync(ArtifactAttachment t)
        {
            try
            {
                var attachment = await base.AddAsync(t);
                return new AddAttachmentResponse
                {
                    Data = new AddAttachmentData { Id = t.Id, Attachment = attachment },
                    Message = "Attachment uploaded successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong adding attachment record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAttachmentResponse> GetAllAttachmentAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstAttachment = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstAttachmentOrdered = lstAttachment.OrderBy(a => a.PublicityRank).ToList<ArtifactAttachment>();
                return new GetAllAttachmentResponse
                {
                    Data = new GetAttachmentsData { ArtifactAttachments = lstAttachmentOrdered},
                    Message = "Attachments retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                //string error = ex.Message;
                return new GetAllAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachments", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentAsync(int id, bool isDeleted, int tenantId)
        {
            try
            {
                var attachment = await FindAsync(a => a.Id.Equals(id) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachment },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false 
                };
            }
        }

        public async Task<UpdateAttachmentResponse> UpdateAttachmentAsync(ArtifactAttachment t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateAttachmentResponse
                {
                    Data = new UpdateAttachmentData { Id = entity.Id, ArtifactAttachment = entity },
                    Success = true,
                    Message = "Attachment updated successfully.",
                    StatusCode = 200
                };
            }
            catch(Exception ex)
            {
                return new UpdateAttachmentResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "Oops! Something went wrong while updating the record", ex.InnerException.ToString() }
                };
            }
        }

        public async Task<DeleteAttachmentResponse> UpdateAttachmentByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var artifactAttachment = await GetByIdAsync(id);
                if (artifactAttachment  == null)
                    return new DeleteAttachmentResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Attachment not found" },
                        StatusCode = 400
                    };

                artifactAttachment.IsDeleted = isDeleted;
                artifactAttachment.DateModified = DateTime.Now;
                await UpdateAsync(artifactAttachment);
                await _context.SaveChangesAsync();
                return new DeleteAttachmentResponse
                {
                    Success = true,
                    Data = new DeleteAttachmentData { IsDeleted = true },
                    Message = "Attachment deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentByAnimalIdAsync(int animalId)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Publicity Rank 0
                var attachmentPublicityRank = attachment.OrderBy(a => a.PublicityRank).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachmentPublicityRank },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<GetAttachmentResponse> GetAttachmentByPCOIdAsync(int pcoId)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.PcoId.Equals(pcoId) && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Publicity Rank 0
                //var lastSeqNo = attachment.LastOrDefault();
                var attachmentPublicityRank = attachment.OrderBy(a => a.PublicityRank).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachmentPublicityRank },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<GetAttachmentResponse> GetAttachmentByTenantIdAsync(int tenantId)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.TenantId.Equals(tenantId) && a.Entity.Equals("Tenant")
                                                       && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Publicity Rank 0
                var lastSeqNo = attachment.OrderBy(a => a.PublicityRank).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = lastSeqNo },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAttachmentResponse> GetAllAttachmentByAnimalIdAsync(int animalId, int tenantId)
        {
            try
            {
                var lstAttachment = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.Entity.Equals("Animal") && a.TenantId.Equals(tenantId) && a.IsDeleted.Equals(false));
                // Get artifact attachments based on Publicity Rank 0
                var lstAttachmentOrdered = lstAttachment.OrderBy(a => a.PublicityRank).ToList<ArtifactAttachment>();
                return new GetAllAttachmentResponse
                {
                    Data = new GetAttachmentsData { ArtifactAttachments = lstAttachmentOrdered },
                    Message = "Attachments retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment list", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAttachmentResponse> GetAllAttachmentByPCOIdAsync(int pcoId, int tenantId)
        {
            try
            {
                var lstAttachment = await FindAllAsync(a => a.PcoId.Equals(pcoId) && a.Entity.Equals("PCO") && a.TenantId.Equals(tenantId) && a.IsDeleted.Equals(false));
                // Get artifact attachments based on Publicity Rank 0
                var lstAttachmentOrdered = lstAttachment.OrderBy(a => a.PublicityRank).ToList<ArtifactAttachment>();
                return new GetAllAttachmentResponse
                {
                    Data = new GetAttachmentsData { ArtifactAttachments = lstAttachmentOrdered },
                    Message = "Attachments retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment list", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAttachmentResponse> GetAllAttachmentByTenantIdAsync(int tenantId)
        {
            try
            {
                var lstAttachment = await FindAllAsync(a => a.TenantId.Equals(tenantId) 
                                                       && a.Entity.Equals("Tenant") 
                                                       && a.IsDeleted.Equals(false));
                // Get artifact attachments based on Publicity Rank 0
                var lstAttachmentOrdered = lstAttachment.OrderBy(a => a.PublicityRank).ToList<ArtifactAttachment>();
                return new GetAllAttachmentResponse
                {
                    Data = new GetAttachmentsData { ArtifactAttachments = lstAttachmentOrdered },
                    Message = "Attachments retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment list", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentCountResponse> GetAttachmentCountByAnimalIdAsync(int animalId)
        {
            try
            {
                var lstAttachment = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.Entity.Equals("Animal") && a.IsDeleted.Equals(false));
                // Get artifact attachments based on Publicity Rank 0
                var lstAttachmentOrdered = lstAttachment.OrderBy(a => a.PublicityRank).ToList<ArtifactAttachment>();
                return new GetAttachmentCountResponse
                {
                    Data = new GetAttachmentCountData { Count = lstAttachmentOrdered.Count(), ArtifactAttachments = lstAttachmentOrdered },
                    Message = "Attachments retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentCountResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment list", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<bool> DeleteArtifactAttachmentByAnimalIdAsync(int animalId)
        {
            try
            {
                var artifactAttachmentUpdate = await FindAllAsync(a => a.AnimalId.Equals(animalId));
                foreach (var item in artifactAttachmentUpdate)
                {
                    item.IsDeleted = true;
                    var entity = UpdateAsync(item);
                }
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return false;
            }
            
        }

        public async Task<GetAttachmentResponse> GetAttachmentSequenceByAnimalIdAsync(int animalId, string entity, string attachmentType)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType) && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Sequence No desc - Last Sequence No
                var attachmentPublicityRank = attachment.OrderByDescending(a => a.SequenceNo).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachmentPublicityRank },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentSequenceByPCOIdAsync(int pcoId, string entity, string attachmentType)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.PcoId.Equals(pcoId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType) && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Sequence No desc - Last Sequence No
                var attachmentPublicityRank = attachment.OrderByDescending(a => a.SequenceNo).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachmentPublicityRank },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentSequenceByTenantIdAsync(int tenantId, string entity, string attachmentType)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.TenantId.Equals(tenantId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType)
                                                       && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Sequence No desc - Last Sequence No
                var lastSeqNo = attachment.OrderByDescending(a => a.SequenceNo).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = lastSeqNo },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentTypeByAnimalIdAsync(int animalId, string entity, string attachmentType)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType) && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Publicity Rank 0
                var attachmentPublicityRank = attachment.OrderBy(a => a.PublicityRank).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachmentPublicityRank },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentTypeByPCOIdAsync(int pcoId, string entity, string attachmentType)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.PcoId.Equals(pcoId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType) && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Publicity Rank 0
                var attachmentPublicityRank = attachment.OrderBy(a => a.PublicityRank).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = attachmentPublicityRank },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAttachmentResponse> GetAttachmentTypeByTenantIdAsync(int tenantId, string entity, string attachmentType)
        {
            try
            {
                var attachment = await FindAllAsync(a => a.TenantId.Equals(tenantId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType)
                                                       && a.IsDeleted.Equals(false));
                // Get artifact attachment based on Publicity Rank 0
                var lastSeqNo = attachment.OrderBy(a => a.SequenceNo).FirstOrDefault();
                return new GetAttachmentResponse
                {
                    Data = new GetAttachmentData { ArtifactAttachment = lastSeqNo },
                    Message = "Attachment retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAttachmentResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting attachment", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public string GetAnimalStatus(string status)
        {
            //adoption

            //outdoorFeral
            //permanentResident
            //quarantineHold
            string strStatus = string.Empty;
            if(!string.IsNullOrEmpty(status))
            {
                if(status.Trim().ToLower().Equals("adoption".Trim().ToLower()))
                {
                    strStatus = "Adoptable";
                }
                else if (status.Trim().ToLower().Equals("outdoorFeral".Trim().ToLower()))
                {
                    strStatus = "Outdoor Feral";
                }
                else if (status.Trim().ToLower().Equals("permanentResident".Trim().ToLower()))
                {
                    strStatus = "Permanent Resident";
                }
                else if (status.Trim().ToLower().Equals("quarantineHold".Trim().ToLower()))
                {
                    strStatus = "Quarantine Hold";
                }
                else
                {
                    strStatus = string.Empty;
                }
            }

            return strStatus;
        }

        public async Task<GetGalleryResponse> GetGalleryPhotosAsync(int tenantId, bool? currentResident, int? animalTypeId, bool? status, string entity, string attachmentType)
        {
            try
            {
                // select distinct AnimalId, Id, Entity, AttachmentType, PublicityRank, SequenceNo, Animal from Attachments where Entity='Animal' and AttachmentType='Photo' and TenantId=2 and PublicityRank=1 and SequenceNo=1 and IsDeleted=0 order by Id desc
                var attachments = await FindAllAsync(a => a.TenantId.Equals(tenantId) && a.Entity.Equals(entity) && a.AttachmentType.Equals(attachmentType)
                                                       && a.IsDeleted.Equals(false) && a.PublicityRank.Equals(1) && !string.IsNullOrEmpty(a.OriginalBlobUrl));
                var lstAttachment = attachments.Where(a => a.SequenceNo.Equals(1)).OrderByDescending(a => a.Id).ToList();

                var lstGallery = new List<Gallery>();

                if (animalTypeId.HasValue && animalTypeId.Value > 0 && currentResident.HasValue && status.HasValue) // When AnimalType and Resident Selected both and status has value
                {
                    if (currentResident.Equals(true) && status.Equals(true)) // Current Resident has value true and Status = true for adoption
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = at.Id,
                                          AnimalTypeName = at.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                      .Where(a => a.CurrentResident.Equals(currentResident) && a.Status.Equals("Adoptable") && a.AnimalTypeId.Equals(animalTypeId.Value)).ToList();
                    }
                    else if (currentResident.Equals(true)) // Current Resident has value true
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = at.Id,
                                          AnimalTypeName = at.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                      .Where(a => a.CurrentResident.Equals(currentResident) && a.AnimalTypeId.Equals(animalTypeId.Value)).ToList();
                    }
                    else // Former residents only with AnimalTypeID selected and there is no adoption status
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = at.Id,
                                          AnimalTypeName = at.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                      .Where(a => a.CurrentResident.Equals(false) && a.AnimalTypeId.Equals(animalTypeId.Value)).ToList();
                    }
                }
                else if (animalTypeId.HasValue && animalTypeId.Value > 0 && currentResident.HasValue) // When AnimalType and Resident Selected both
                {
                    if (currentResident.Equals(true)) // Current Resident has value true with AnimalTypeID
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = at.Id,
                                          AnimalTypeName = at.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                      .Where(a => a.CurrentResident.Equals(currentResident) && a.AnimalTypeId.Equals(animalTypeId.Value)).ToList();
                    }
                    else // Former residents only with AnimalTypeID selected and there is no adoption status
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = at.Id,
                                          AnimalTypeName = at.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                      .Where(a => a.CurrentResident.Equals(false) && a.AnimalTypeId.Equals(animalTypeId.Value)).ToList();
                    }
                }
                else if (currentResident.HasValue && status.HasValue) // When resident selected only
                {
                    if(currentResident.Equals(true) && status.Equals(true)) // Current Residents only
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                          AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                  .Where(a => a.CurrentResident.Equals(currentResident) && a.Status.Equals("Adoptable")).ToList();
                    }
                    else if (currentResident.Equals(true)) // Current Residents only
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                          AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                  .Where(a => a.CurrentResident.Equals(currentResident)).ToList();
                    }
                    else // Former residents only
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                          AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                  .Where(a => a.CurrentResident.Equals(false)).ToList();
                    }
                }
                else if (animalTypeId.HasValue && animalTypeId.Value > 0) // When Animal Type Selected only
                {
                    lstGallery = (from att in lstAttachment
                                  join a in _dbContext.Animals on att.AnimalId equals a.Id
                                  join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                  select new Gallery
                                  {
                                      AnimalId = a.Id,
                                      AnimalName = a.AnimalName,
                                      AnimalTypeId = at.Id,
                                      AnimalTypeName = at.TypeName,
                                      BlobUrl = att.BlobUrl,
                                      ImageName = att.FileName,
                                      OriginalBlobUrl = att.OriginalBlobUrl,
                                      PublicityRank = att.PublicityRank,
                                      ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                      CurrentResident = a.CurrentResident.Value,
                                      Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                  }).Where(g => g.AnimalTypeId.Equals(animalTypeId.Value)).ToList();
                }
                else if (currentResident.HasValue) // When resident selected only
                {
                    if (currentResident.Equals(true)) // Current Residents only
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                          AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                  .Where(a => a.CurrentResident.Equals(currentResident)).ToList();
                    }
                    else // Former residents only
                    {
                        lstGallery = (from att in lstAttachment
                                      join a in _dbContext.Animals on att.AnimalId equals a.Id
                                      select new Gallery
                                      {
                                          AnimalId = a.Id,
                                          AnimalName = a.AnimalName,
                                          AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                          AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                          BlobUrl = att.BlobUrl,
                                          ImageName = att.FileName,
                                          OriginalBlobUrl = att.OriginalBlobUrl,
                                          PublicityRank = att.PublicityRank,
                                          ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                          CurrentResident = a.CurrentResident.Value,
                                          Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                      })
                                  .Where(a => a.CurrentResident.Equals(false)).ToList();
                    }
                }
                else if (status.HasValue && status.Equals(true)) // Current Residents only
                {
                    lstGallery = (from att in lstAttachment
                                  join a in _dbContext.Animals on att.AnimalId equals a.Id
                                  select new Gallery
                                  {
                                      AnimalId = a.Id,
                                      AnimalName = a.AnimalName,
                                      AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                      AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                      BlobUrl = att.BlobUrl,
                                      ImageName = att.FileName,
                                      OriginalBlobUrl = att.OriginalBlobUrl,
                                      PublicityRank = att.PublicityRank,
                                      ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                      CurrentResident = a.CurrentResident.Value,
                                      Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                  })
                                  .Where(a => a.CurrentResident.Equals(currentResident) && a.Status.Equals("Adoptable")).ToList();
                }
                else // For ALL selection
                {
                    lstGallery = (from att in lstAttachment
                                  join a in _dbContext.Animals on att.AnimalId equals a.Id
                                  select new Gallery
                                  {
                                      AnimalId = a.Id,
                                      AnimalName = a.AnimalName,
                                      AnimalTypeId = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.Id,
                                      AnimalTypeName = _animalTypeRepository.GetByIdAsync(a.AnimalTypeId.Value).Result.TypeName,
                                      BlobUrl = att.BlobUrl,
                                      ImageName = att.FileName,
                                      OriginalBlobUrl = att.OriginalBlobUrl,
                                      PublicityRank = att.PublicityRank,
                                      ThumbnailBlobUrl = att.ThumbnailBlobUrl,
                                      CurrentResident = a.CurrentResident.Value,
                                      Status = !string.IsNullOrEmpty(a.Status.Trim()) ? GetAnimalStatus(a.Status) : string.Empty
                                  }).ToList();
                }

                return new GetGalleryResponse
                {
                    Data = new GetGalleryData { Count = lstGallery.Count, Gallery = lstGallery },
                    Message = "Gallery retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetGalleryResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting gallery", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
