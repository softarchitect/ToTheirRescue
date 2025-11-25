using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAHealthProcedureResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ISAHealthProcedureService
    {
        Task<List<SAHealthProcedure>> GetAllAsync();
        Task<SAHealthProcedure> GetByIdAsync(int id);
        Task<AddSAHealthProcedureResponse> AddSAHealthProcedureAsync(SAHealthProcedure t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteSAHealthProcedureResponse> UpdateSAHealthProcedureByDeletedAsync(int id, bool isDeleted);
        Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProcedurersAsync(bool isDeleted);
        Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProceduresByAnimalIdAsync(bool isDeleted, int saAnimalTypeId);
        Task<GetAvailableSAHealthProcedureResponse> AvailableSAHealthProcedure(bool isDeleted, string saHealthProcedure, int saAnimalTypeId);
        Task<UpdateSAHealthProcedureResponse> UpdateSAHealthProcedureAsync(SAHealthProcedure t);
    }
}
