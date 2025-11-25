using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DiaryResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IDiaryRepository: IRepositoryBase<Diary>
    {
        Task<AddDiaryResponse> AddDiaryAsync(Diary diary);
        Task<DeleteDiaryResponse> UpdateDiaryByDeletedAsync(int id, bool isDeleted);
        Task<UpdateDiaryResponse> UpdateDiaryAsync(int id, Diary diary);
        Task<GetDiaryResponse> GetDiaryByAnimalIdAsync(int animalId, bool isDeleted, string entityType, int tenantId);
        Task<GetDiaryResponse> GetDiaryByTenantIdAsync(string entityType, bool isDeleted, int tenantId);
    }
}
