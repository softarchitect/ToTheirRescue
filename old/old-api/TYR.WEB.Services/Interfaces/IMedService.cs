using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Models.Response.MedResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IMedService
    {
        Task<AddMedResponse> AddMedAsync(List<Med> meds);
        Task<DeleteMedResponse> UpdateMedByDeletedAsync(int id, bool isDeleted);
        Task<UpdateMedResponse> UpdateMedAsync(int id, Med med);
        Task<GetMedResponse> GetMedByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId);
        Task<Med> GetMedByIdAsync(int id);
        Task<GetAllMedResponse> GetMedByTenantIdAsync(bool isDeleted, bool blnReminder, int days, int tenantId);
        Task<UpdateMedGivenListResponse> UpdateMedGivenListAsync(List<int> ids);
        Task<UpdateMedCompletedResponse> UpdateMedCompletedByIdAsync(int id);
    }
}
