using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAnimalProcedureService
    {
        Task<AddAnimalProcedureResponse> AddAnimalProcedureAsync(List<AnimalProcedure> animalProcedures);
        Task<DeleteAnimalProcedureResponse> UpdateAnimalProcedureByDeletedAsync(int id, bool isDeleted);
        Task<UpdateAnimalProcedureResponse> UpdateAnimalProcedureAsync(AnimalProcedure t, int id);
        Task<GetAnimalProcedureResponse> GetAnimalProcedureByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId);
        Task<AnimalProcedure> GetAnimalProcedureByIdAsync(int id);
        Task<GetAnimalWeightHistoryResponse> GetAnimalWeightHistoryByAnimalIdAsync(int animalId, int tenantId);
        Task<GetAllAnimalProcedureResponse> GetAllAnimalProceduresAsync(bool isDeleted, bool blnReminder, int days, int tenantId);
    }
}
