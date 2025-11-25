using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Models.Response.MedResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class MedService : IMedService
    {
        private readonly IMedRepository _medRepository;
        public MedService(IMedRepository medRepository) => _medRepository = medRepository;
        public async Task<AddMedResponse> AddMedAsync(List<Med> meds) => await _medRepository.AddMedAsync(meds);

        public async Task<Med> GetMedByIdAsync(int id) => await _medRepository.GetByIdAsync(id);

        public async Task<GetMedResponse> GetMedByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId) => await _medRepository.GetMedByAnimalIdAsync(animalId, isDeleted, blnReminder, tenantId);

        public async Task<UpdateMedResponse> UpdateMedAsync(int id, Med med) => await _medRepository.UpdateMedAsync(med, id);

        public async Task<DeleteMedResponse> UpdateMedByDeletedAsync(int id, bool isDeleted) => await _medRepository.UpdateMedByDeletedAsync(id, isDeleted);
        public async Task<GetAllMedResponse> GetMedByTenantIdAsync(bool isDeleted, bool blnReminder, int days, int tenantId) => await _medRepository.GetMedByTenantIdAsync(isDeleted, blnReminder, days, tenantId);
        public async Task<UpdateMedGivenListResponse> UpdateMedGivenListAsync(List<int> ids) => await _medRepository.UpdateMedGivenListAsync(ids);
        public async Task<UpdateMedCompletedResponse> UpdateMedCompletedByIdAsync(int id) => await _medRepository.UpdateMedCompletedByIdAsync(id);

    }
}
