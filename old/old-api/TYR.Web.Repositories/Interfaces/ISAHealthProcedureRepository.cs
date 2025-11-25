using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAHealthProcedureResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISAHealthProcedureRepository: IRepositoryBase<SAHealthProcedure>
    {
        Task<AddSAHealthProcedureResponse> AddSAHealthProcedureAsync(SAHealthProcedure t);
        Task<DeleteSAHealthProcedureResponse> UpdateSAHealthProcedureByDeletedAsync(int id, bool isDeleted);
        Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProceduresAsync(bool isDeleted);
        Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProceduresAnimalTypeIdAsync(bool isDeleted, int saAnimalTypeId);
        Task<GetAvailableSAHealthProcedureResponse> AvailableSAHealthProcedure(bool isDeleted, string saHealthProcedure, int saAnimalTypeId);
        Task<UpdateSAHealthProcedureResponse> UpdateSAHealthProcedureAsync(SAHealthProcedure t);
    }
}
