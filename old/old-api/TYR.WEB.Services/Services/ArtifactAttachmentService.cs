using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AttachmentResult;
using TYR.WEB.Models.ViewModels.AttachmentViewModel;
using TYR.WEB.Services.Interfaces;
namespace TYR.WEB.Services.Services
{
    public class ArtifactAttachmentService : IArtifactAttachmentService
    {
        private readonly IArtifactAttachmentRepository _artifactAttachmentRepository;
        public ArtifactAttachmentService(IArtifactAttachmentRepository artifactAttachmentRepository) => _artifactAttachmentRepository = artifactAttachmentRepository;
        public async Task<AddAttachmentResponse> AddAttachmentAsync(ArtifactAttachment t) => await _artifactAttachmentRepository.AddAttachmentAsync(t);
        public async Task<DeleteAttachmentResponse> UpdateAttachmentByDeletedAsync(int id, bool isDeleted) => await _artifactAttachmentRepository.UpdateAttachmentByDeletedAsync(id, isDeleted);
        public async Task<GetAllAttachmentResponse> GetAllAttachmentAsync(bool isDeleted, int tenantId) => await _artifactAttachmentRepository.GetAllAttachmentAsync(isDeleted, tenantId);
        public async Task<GetAttachmentResponse> GetAttachmentAsync(int id, bool isDeleted, int tenantId) => await _artifactAttachmentRepository.GetAttachmentAsync(id, isDeleted, tenantId);
        public async Task<UpdateAttachmentResponse> UpdateAttachmentAsync(ArtifactAttachment t) => await _artifactAttachmentRepository.UpdateAttachmentAsync(t);
        public async Task<ArtifactAttachment> GetArtifactById(int id) => await _artifactAttachmentRepository.GetByIdAsync(id);

        //public async Task<string> GetFileName(string entityType, string documentType, int EntityId, int seqno, string fileExtension)
        //public async Task<string> GetFileName(string entityType, string documentType, int tenantId, int EntityId, int seqno, string file)
        public string GetFileName(string entityType, string documentType, int tenantId, int EntityId, int seqno, string file)
        {
            //BlobFileName blobFileName = new BlobFileName();
            string imageName = string.Empty;
            if (entityType == AttachmentEntity.ANIMAL)
            {
                // Explanation of File Name: 2-A-1171-3-Bella.jpg (TenantID-A-AnimalId-SequenceNo-OriginalFileName.FileExtension)
                if (documentType == AttachmentType.DOCUMENT)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_ANIMAL_DOCUMENT, EntityId, NameSuffix.ANIMAL, EntityId, seqno, fileExtension);
                    //imageName = string.Format("{0}{1}/{2}{3}{4}_{5}", BlobContainer.CONTAINER_PATH_ANIMAL_DOCUMENT, EntityId, NameSuffix.ANIMAL, EntityId, seqno, file);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_ANIMAL_DOCUMENT, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}_{3}-{4}", tenantId, NameSuffix.ANIMAL, EntityId, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}_{5}-{6}", BlobContainer.CONTAINER_PATH_ANIMAL_DOCUMENT, EntityId, tenantId, NameSuffix.ANIMAL, EntityId, seqno, file);
                }
                if (documentType == AttachmentType.PHOTO)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_ANIMAL_PHOTO, EntityId,NameSuffix.ANIMAL, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_ANIMAL_PHOTO, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}_{3}-{4}", tenantId, NameSuffix.ANIMAL, EntityId, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}_{5}-{6}", BlobContainer.CONTAINER_PATH_ANIMAL_PHOTO, EntityId, tenantId, NameSuffix.ANIMAL, EntityId, seqno, file);
                }
                if (documentType == AttachmentType.VIDEO)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_ANIMAL_VIDEO, EntityId, NameSuffix.ANIMAL, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_ANIMAL_VIDEO, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}_{3}-{4}", tenantId, NameSuffix.ANIMAL, EntityId, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}_{5}-{6}", BlobContainer.CONTAINER_PATH_ANIMAL_VIDEO, EntityId, tenantId, NameSuffix.ANIMAL, EntityId, seqno, file);
                }
            }
            if(entityType == AttachmentEntity.PCO)
            {
                // Explanation of File Name: 2-P-1171-3-Bella.jpg (TenantID-A-AnimalId-SequenceNo-OriginalFileName.FileExtension)
                if (documentType == AttachmentType.DOCUMENT)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_PCO_DOCUMENT, EntityId, NameSuffix.PCO, EntityId, seqno, fileExtension);
                    //imageName = string.Format("{0}{1}/{2}{3}{4}_{5}", BlobContainer.CONTAINER_PATH_PCO_DOCUMENT, EntityId, NameSuffix.PCO, EntityId, seqno, file);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_PCO_DOCUMENT, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}_{3}-{4}", tenantId, NameSuffix.PCO, EntityId, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}_{5}-{6}", BlobContainer.CONTAINER_PATH_PCO_DOCUMENT, EntityId, tenantId, NameSuffix.PCO, EntityId, seqno, file);
                }
                if (documentType == AttachmentType.PHOTO)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_PCO_PHOTO , EntityId, NameSuffix.PCO, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_PCO_PHOTO, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}_{3}-{4}", tenantId, NameSuffix.PCO, EntityId, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}_{5}-{6}", BlobContainer.CONTAINER_PATH_PCO_PHOTO, EntityId, tenantId, NameSuffix.PCO, EntityId, seqno, file);
                }
                if (documentType == AttachmentType.VIDEO)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_PCO_VIDEO, EntityId , NameSuffix.PCO, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_PCO_VIDEO, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}_{3}-{4}", tenantId, NameSuffix.PCO, EntityId, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}_{5}-{6}", BlobContainer.CONTAINER_PATH_PCO_VIDEO, EntityId, tenantId, NameSuffix.PCO, EntityId, seqno, file);
                }
            }
            if(entityType== AttachmentEntity.TENANT)
            {
                // Explanation of File Name: 2-R-3-Bella.jpg (TenantID-R-SequenceNo-OriginalFileName.FileExtension)
                if (documentType == AttachmentType.DOCUMENT)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_TENENAT_DOCUMENT, EntityId, NameSuffix.TENANT, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_TENANT_DOCUMENT, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}-{3}", tenantId, NameSuffix.TENANT, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}-{5}", BlobContainer.CONTAINER_PATH_TENANT_DOCUMENT, EntityId, tenantId, NameSuffix.TENANT, seqno, file);
                }
                if (documentType == AttachmentType.PHOTO)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_TENENAT_PHOTO, EntityId, NameSuffix.TENANT, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_TENANT_PHOTO, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}-{3}", tenantId, NameSuffix.TENANT, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}-{5}", BlobContainer.CONTAINER_PATH_TENANT_PHOTO, EntityId, tenantId, NameSuffix.TENANT, seqno, file);
                }
                if (documentType == AttachmentType.VIDEO)
                {
                    //imageName = string.Format("{0}{1}/{2}_{3}_{4}{5}", BlobContainer.CONTAINER_PATH_TENENAT_VIDEO, EntityId, NameSuffix.TENANT, EntityId, seqno, fileExtension);
                    //blobFileName.BlobName = string.Format("{0}{1}", BlobContainer.CONTAINER_PATH_TENANT_VIDEO, EntityId);
                    //blobFileName.FileName = string.Format("{0}-{1}-{2}-{3}", tenantId, NameSuffix.TENANT, seqno, file);
                    imageName = string.Format("{0}{1}/{2}-{3}-{4}-{5}", BlobContainer.CONTAINER_PATH_TENANT_VIDEO, EntityId, tenantId, NameSuffix.TENANT, seqno, file);
                }
            }
            //return blobFileName;
            return imageName;
        }

        public async Task<GetAttachmentResponse> GetAttachmentByAnimalIdAsync(int animalId) => await _artifactAttachmentRepository.GetAttachmentByAnimalIdAsync(animalId);
        public async Task<GetAttachmentResponse> GetAttachmentByPCOIdAsync(int pcoId) => await _artifactAttachmentRepository.GetAttachmentByPCOIdAsync(pcoId);
        public async Task<GetAttachmentResponse> GetAttachmentByTenantIdAsync(int tenantId) => await _artifactAttachmentRepository.GetAttachmentByTenantIdAsync(tenantId);

        public async Task<GetAllAttachmentResponse> GetAllAttachmentByAnimalIdAsync(int animalId, int tenantId) => await _artifactAttachmentRepository.GetAllAttachmentByAnimalIdAsync(animalId, tenantId);

        public async Task<GetAllAttachmentResponse> GetAllAttachmentByPCOIdAsync(int pcoId, int tenantId) => await _artifactAttachmentRepository.GetAllAttachmentByPCOIdAsync(pcoId, tenantId);

        public async Task<GetAllAttachmentResponse> GetAllAttachmentByTenantIdAsync(int tenantId) => await _artifactAttachmentRepository.GetAllAttachmentByTenantIdAsync(tenantId);
        public async Task<GetAttachmentCountResponse> GetAttachmentCountByAnimalIdAsync(int animalId) => await _artifactAttachmentRepository.GetAttachmentCountByAnimalIdAsync(animalId);
        public async Task<bool> DeleteArtifactAttachmentByAnimalIdAsync(int animalId) => await _artifactAttachmentRepository.DeleteArtifactAttachmentByAnimalIdAsync(animalId);

        public async Task<GetAttachmentResponse> GetAttachmentSequenceByAnimalIdAsync(int animalId, string entity, string attachmentType) 
            => await _artifactAttachmentRepository.GetAttachmentSequenceByAnimalIdAsync(animalId, entity, attachmentType);

        public async Task<GetAttachmentResponse> GetAttachmentSequenceByPCOIdAsync(int pcoId, string entity, string attachmentType) 
            => await _artifactAttachmentRepository.GetAttachmentSequenceByPCOIdAsync(pcoId, entity, attachmentType);

        public async Task<GetAttachmentResponse> GetAttachmentSequenceByTenantIdAsync(int tenantId, string entity, string attachmentType) 
            => await _artifactAttachmentRepository.GetAttachmentSequenceByTenantIdAsync(tenantId, entity, attachmentType);

        public async Task<GetAttachmentResponse> GetAttachmentTypeByAnimalIdAsync(int animalId, string entity, string attachmentType)
            => await _artifactAttachmentRepository.GetAttachmentTypeByAnimalIdAsync(animalId, entity, attachmentType);

        public async Task<GetAttachmentResponse> GetAttachmentTypeByPCOIdAsync(int pcoId, string entity, string attachmentType)
            => await _artifactAttachmentRepository.GetAttachmentTypeByPCOIdAsync(pcoId, entity, attachmentType);

        public async Task<GetAttachmentResponse> GetAttachmentTypeByTenantIdAsync(int tenantId, string entity, string attachmentType)
            => await _artifactAttachmentRepository.GetAttachmentTypeByTenantIdAsync(tenantId, entity, attachmentType);

        public async Task<GetGalleryResponse> GetGalleryPhotosAsync(int tenantId, bool? currentResident, int? animalTypeId, bool? status, string entity, string attachmentType) 
            => await _artifactAttachmentRepository.GetGalleryPhotosAsync(tenantId, currentResident,  animalTypeId, status, entity, attachmentType);
    }
}
