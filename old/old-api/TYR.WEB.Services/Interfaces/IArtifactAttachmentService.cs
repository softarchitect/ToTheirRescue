using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AttachmentResult;
using TYR.WEB.Models.ViewModels.AttachmentViewModel;

namespace TYR.WEB.Services.Interfaces
{
    public interface IArtifactAttachmentService
    {
        Task<AddAttachmentResponse> AddAttachmentAsync(ArtifactAttachment t);
        Task<DeleteAttachmentResponse> UpdateAttachmentByDeletedAsync(int id, bool isDeleted);
        Task<GetAllAttachmentResponse> GetAllAttachmentAsync(bool isDeleted, int tenantId);
        Task<GetAttachmentResponse> GetAttachmentAsync(int id, bool isDeleted, int tenantId);
        Task<UpdateAttachmentResponse> UpdateAttachmentAsync(ArtifactAttachment t);
        Task<ArtifactAttachment> GetArtifactById(int id);
        //Task<string> GetFileName(string entityType, string docuementType, int tenantId, int EntityId, int seqno, string fileExtension);
        string GetFileName(string entityType, string docuementType, int tenantId, int EntityId, int seqno, string fileExtension);
        //BlobFileName GetFileName(string entityType, string docuementType, int tenantId, int EntityId, int seqno, string fileExtension);
        Task<GetAttachmentResponse> GetAttachmentByAnimalIdAsync(int animalId);
        Task<GetAttachmentResponse> GetAttachmentByPCOIdAsync(int pcoId);
        Task<GetAttachmentResponse> GetAttachmentByTenantIdAsync(int tenantId);
        Task<GetAllAttachmentResponse> GetAllAttachmentByAnimalIdAsync(int animalId, int tenantId);
        Task<GetAllAttachmentResponse> GetAllAttachmentByPCOIdAsync(int pcoId, int tenantId);
        Task<GetAllAttachmentResponse> GetAllAttachmentByTenantIdAsync(int tenantId);
        Task<GetAttachmentCountResponse> GetAttachmentCountByAnimalIdAsync(int animalId);
        Task<bool> DeleteArtifactAttachmentByAnimalIdAsync(int animalId);
        Task<GetAttachmentResponse> GetAttachmentSequenceByAnimalIdAsync(int animalId, string entity, string attachmentType);
        Task<GetAttachmentResponse> GetAttachmentSequenceByPCOIdAsync(int pcoId, string entity, string attachmentType);
        Task<GetAttachmentResponse> GetAttachmentSequenceByTenantIdAsync(int tenantId, string entity, string attachmentType);

        Task<GetAttachmentResponse> GetAttachmentTypeByAnimalIdAsync(int animalId, string entity, string attachmentType);
        Task<GetAttachmentResponse> GetAttachmentTypeByPCOIdAsync(int pcoId, string entity, string attachmentType);
        Task<GetAttachmentResponse> GetAttachmentTypeByTenantIdAsync(int tenantId, string entity, string attachmentType);
        Task<GetGalleryResponse> GetGalleryPhotosAsync(int tenantId, bool? currentResident, int? animalTypeId, bool? status, string entity, string attachmentType);
    }
}
