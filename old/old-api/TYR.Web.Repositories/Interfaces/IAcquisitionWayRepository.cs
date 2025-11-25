using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AcquisitionWayResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IAcquisitionWayRepository : IRepositoryBase<AcquisitionWay>
    {
        Task<AddAcquisitionWayResponse> AddAcquisitionWayAsync(AcquisitionWay t);
        Task<DeleteAcquisitionWayResponse> UpdateAnimalAcquisitionByDeletedAsync(int id, bool isDeleted);
        Task<GetAllAcquisitionWayResponse> GetAllAnimalAcquisitionsAsync(bool isDeleted, int tenantId);
        Task<GetAvailableAcquisitionWayResponse> AvailableAnimalAcquisition(bool isDeleted, string acquisitionWay, int tenantId);
        Task<UpdateAcquisitionWayResponse> UpdateAcquisitionWayAsync(AcquisitionWay t);
    }
}
