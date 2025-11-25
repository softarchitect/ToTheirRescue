using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalMilestoneResult;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IAnimalProcedureRepository : IRepositoryBase<AnimalProcedure>
    {
        Task<AddAnimalProcedureResponse> AddAnimalProcedureAsync(List<AnimalProcedure> animalProcedures);
        Task<DeleteAnimalProcedureResponse> UpdateAnimalProcedureByDeletedAsync(int id, bool isDeleted);
        Task<UpdateAnimalProcedureResponse> UpdateAnimalProcedureAsync(AnimalProcedure t, int id);
        Task<GetAnimalProcedureResponse> GetAnimalProcedureByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId);
        Task<GetAnimalWeightHistoryResponse> GetAnimalWeightHistoryByAnimalIdAsync(int animalId, int tenantId);
        Task<GetAllAnimalProcedureResponse> GetAllAnimalProceduresAsync(bool isDeleted, bool blnReminder, int days, int tenantId);
        
    }
}
