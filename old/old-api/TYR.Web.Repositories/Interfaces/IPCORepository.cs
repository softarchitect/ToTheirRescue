using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.PCO;
using TYR.WEB.Models.Response.PCOResult;
using TYR.WEB.Models.Paging;

namespace TYR.Web.Repositories.Interfaces
{
#pragma warning disable S101 // Types should be named in PascalCase
    public interface IPCORepository : IRepositoryBase<PCO>
#pragma warning restore S101 // Types should be named in PascalCase
    {

        Task<AddPCOResponse> AddNewPCO(PCO pco, int tenantId);
        Task<GetPcoListPageResponse> GetPCOListAsync(int tenantId, bool isDeleted, string searchText, string entityType, int limit, int page);
        Task<GetPCOAvailableResponse> AvailablePCO(bool isDeleted, PCO pco, int tenantId);
        Task<DeletePCOResponse> DeletePcoByIdAsync( int pcoId);
        Task<UpdatePCOResponse> UpdatePCOByIdAsync(PCO pco, int pcoid, string _userName);
        Task<PcoSearchAutoCompleteListResponse> PcoSearchAutoCompleteListAsync(int tenantId, string searchText, string entityType, int limit);
        Task<PCODropDownResponse> AutoCompletePcoListAsync(int tenantId, bool isDeleted,string searchText, string entityType, int limit, int page);
        Task<PCOCountResponse> GetPCOCount(int tenantId);
        Task<GetPCOHospitalResponse> GetPCOHospitalsAsync(int tenantId);
        Task<GetPCOOtherRescueResponse> GetPCOOtherRescuesAsync(int tenantId);
        Task<PCO> GetPCOHospitalAsync(int pcoId, int tenantId);
        Task<GetPcoHistoryResponse> GetPcosHistoryAsync(int pcoId, int tenantId);
    }
}
