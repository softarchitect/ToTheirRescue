using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AcquisitionWayResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAcquisitionWayService
    {
        Task<List<AcquisitionWay>> GetAllAsync();
        Task<AcquisitionWay> GetByIdAsync(int id);
        Task<AddAcquisitionWayResponse> AddAcquisitionWayAsync(AcquisitionWay t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteAcquisitionWayResponse> UpdateAnimalAcquisitionByDeletedAsync(int id, bool isDeleted);
        Task<GetAllAcquisitionWayResponse> GetAllAnimalAcquisitionsAsync(bool isDeleted, int tenantId);
        Task<GetAvailableAcquisitionWayResponse> AvailableAnimalAcquisition(bool isDeleted, string acquisition, int tenantId);
        Task<UpdateAcquisitionWayResponse> UpdateAcquisitionWayAsync(AcquisitionWay t);
    }
}
