using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.PCOResult;
using TYR.WEB.Services.Interfaces;
namespace TYR.WEB.Services.Services
{
#pragma warning disable S101 // Types should be named in PascalCase
    public class PCOService : IPCOService
#pragma warning restore S101 // Types should be named in PascalCase
    {
        private readonly IPCORepository _pcoRepository;
        public PCOService(IPCORepository pcoRepository) => _pcoRepository = pcoRepository;
        public async Task<AddPCOResponse> AddNewPCO(PCO pco, int tenantId) => await _pcoRepository.AddNewPCO(pco, tenantId);
        public async Task<GetPcoListPageResponse> GetPCOListAsync(int tenantId, bool isDeleted, string searchText, string entityType, int limit, int page) => await _pcoRepository.GetPCOListAsync(tenantId, isDeleted, searchText, entityType, limit, page);
        public async Task<GetPCOAvailableResponse> AvailablePCO(bool isDeleted, PCO pco, int tenantId) => await _pcoRepository.AvailablePCO(isDeleted, pco, tenantId);
        public async Task<DeletePCOResponse> DeletePcoByIdAsync(int pcoId) => await _pcoRepository.DeletePcoByIdAsync(pcoId);
        public async Task<UpdatePCOResponse> UpdatePCOByIdAsync(PCO pco, int pcoId, string _userName) => await _pcoRepository.UpdatePCOByIdAsync(pco, pcoId, _userName);
        public async Task<PcoSearchAutoCompleteListResponse> PCOSearchAutoCompleteListAsync(int tenantId, string searchText, string entityType, int limit) => await _pcoRepository.PcoSearchAutoCompleteListAsync(tenantId, searchText, entityType, limit);
        public async Task<PCODropDownResponse> AutoCompletePcoListAsync(int tenantId, bool isDeleted, string searchText, string entityType, int limit, int page) => await _pcoRepository.AutoCompletePcoListAsync(tenantId, isDeleted, searchText, entityType, limit, page);
        public async Task<PCOCountResponse> GetPCOCount(int tenantId) =>await _pcoRepository.GetPCOCount(tenantId);
        public async Task<PCO> GetPCOById(int Id) => await _pcoRepository.GetByIdAsync(Id);
        public async Task<GetPCOHospitalResponse> GetPCOHospitalsAsync(int tenantId) => await _pcoRepository.GetPCOHospitalsAsync(tenantId);
        public async Task<GetPCOOtherRescueResponse> GetPCOOtherRescuesAsync(int tenantId) => await _pcoRepository.GetPCOOtherRescuesAsync(tenantId);
        public async Task<GetPcoHistoryResponse> GetPcosHistoryAsync(int pcoId, int tenantId) => await _pcoRepository.GetPcosHistoryAsync(pcoId, tenantId);
    }
}
