using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Paging;
using TYR.WEB.Models.Response.PCOResult;
namespace TYR.WEB.Services.Interfaces
{
#pragma warning disable S101 // Types should be named in PascalCase
    public interface IPCOService
#pragma warning restore S101 // Types should be named in PascalCase
    {
        Task<AddPCOResponse> AddNewPCO(PCO pco, int tenantId);
        Task<GetPCOAvailableResponse> AvailablePCO(bool isDeleted, PCO pco, int tenantId);
        Task<GetPcoListPageResponse> GetPCOListAsync(int tenantId, bool isDeleted, string searchText, string entityType, int limit, int page);
        Task<DeletePCOResponse> DeletePcoByIdAsync(int pcoId);
        Task<UpdatePCOResponse> UpdatePCOByIdAsync(PCO pco, int pcoId, string _userName);
        Task<PcoSearchAutoCompleteListResponse> PCOSearchAutoCompleteListAsync(int tenantId, string searchText, string entityType, int limit);
        Task<PCODropDownResponse> AutoCompletePcoListAsync(int tenantId, bool isDeleted,string searchText, string entityType, int limit, int page);
        Task<PCOCountResponse> GetPCOCount(int tenantId);
        Task<PCO> GetPCOById(int Id);
        Task<GetPCOHospitalResponse> GetPCOHospitalsAsync(int tenantId);
        Task<GetPCOOtherRescueResponse> GetPCOOtherRescuesAsync(int tenantId);
        Task<GetPcoHistoryResponse> GetPcosHistoryAsync(int pcoId, int tenantId);
    }
}
