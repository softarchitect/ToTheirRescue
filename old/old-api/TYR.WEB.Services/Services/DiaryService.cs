using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalVaccinationResult;
using TYR.WEB.Models.Response.DiaryResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class DiaryService : IDiaryService
    {
        private readonly IDiaryRepository _diaryRepository;
        public DiaryService(IDiaryRepository diaryRepository) => _diaryRepository = diaryRepository;
        public async Task<AddDiaryResponse> AddDiaryAsync(Diary diary) => await _diaryRepository.AddDiaryAsync(diary);

        public async Task<GetDiaryResponse> GetDiaryByAnimalIdAsync(int animalId, bool isDeleted, string entityType, int tenantId) => await _diaryRepository.GetDiaryByAnimalIdAsync(animalId, isDeleted, entityType, tenantId);

        public async Task<Diary> GetDiaryByIdAsync(int id) => await _diaryRepository.GetByIdAsync(id);

        public async Task<GetDiaryResponse> GetDiaryByTenantIdAsync(string entityType, bool isDeleted, int tenantId) => await _diaryRepository.GetDiaryByTenantIdAsync(entityType, isDeleted, tenantId);

        public async Task<UpdateDiaryResponse> UpdateDiaryAsync(int id, Diary diary) => await _diaryRepository.UpdateDiaryAsync(id, diary);

        public async Task<DeleteDiaryResponse> UpdateDiaryByDeletedAsync(int id, bool isDeleted) => await _diaryRepository.UpdateDiaryByDeletedAsync(id, isDeleted);
    }
}
