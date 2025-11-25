using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthProcedureResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IHealthProcedureRepository : IRepositoryBase<HealthProcedure>
    {
        Task<AddHealthProcedureResponse> AddHealthProcedureAsync(HealthProcedure t);
        Task<DeleteHealthProcedureResponse> UpdateHealthProcedureByDeletedAsync(int id, bool isDeleted);
        Task<GetAllHealthProcedureResponse> GetAllHealthProceduresAsync(bool isDeleted, int tenantId);
        Task<GetAllHealthProcedureResponse> GetAllHealthProceduresAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId);
        Task<GetAvailableHealthProcedureResponse> AvailableHealthProcedure(bool isDeleted, string healthProcedure, int tenantId, int animaltypeId);
        Task<UpdateHealthProcedureResponse> UpdateHealthProcedureAsync(HealthProcedure t);
    }
}
