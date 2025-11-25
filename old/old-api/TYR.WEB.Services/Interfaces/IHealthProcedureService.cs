using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthProcedureResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IHealthProcedureService
    {
        Task<List<HealthProcedure>> GetAllAsync();
        Task<HealthProcedure> GetByIdAsync(int id);
        Task<AddHealthProcedureResponse> AddHealthProcedureAsync(HealthProcedure t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteHealthProcedureResponse> UpdateHealthProcedureByDeletedAsync(int id, bool isDeleted);
        Task<GetAllHealthProcedureResponse> GetAllHealthProcedurersAsync(bool isDeleted, int tenantId);
        Task<GetAllHealthProcedureResponse> GetAllHealthProceduresByAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId);
        Task<GetAvailableHealthProcedureResponse> AvailableHealthProcedure(bool isDeleted, string healthProcedure, int tenantId, int animaltypeId);
        Task<UpdateHealthProcedureResponse> UpdateHealthProcedureAsync(HealthProcedure t);
    }
}
