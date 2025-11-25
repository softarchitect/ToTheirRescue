using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SOAPResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISOAPRepository: IRepositoryBase<SOAP>
    {
        Task<AddSOAPResponse> AddSOAPAsync(SOAP soap);
        Task<DeleteSOAPResponse> UpdateSOAPByDeletedAsync(int id, bool isDeleted);
        Task<UpdateSOAPResponse> UpdateSOAPAsync(int id, SOAP soap);
        Task<GetSOAPResponse> GetSOAPByAnimalIdAsync(int animalId, bool isDeleted, int tenantId);
        Task<GetSOAPResponse> GetSOAPByTenantIdAsync(bool isDeleted, int tenantId);
    }
}
