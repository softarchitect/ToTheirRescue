using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.TenantResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class TenantService : ITenantService
    {
        private readonly ITenantRepository _tenantRepository;
        private readonly IMapper _mapper;
        public TenantService(ITenantRepository tenantRepository, IMapper mapper) { _tenantRepository = tenantRepository; _mapper = mapper; }
        
        public async Task<CreateTenantResponse> CreateTenantAsync(Tenant tenant) => await _tenantRepository.CreateTenantAsync(tenant);
        
        public async Task<Tenant> GetTenantbyIdAsync(int id) => await _tenantRepository.GetByIdAsync(id);
        
        public async Task<Tenant> GetTenantByNameAsync(string name) => await _tenantRepository.GetTenantByNameAsync(name);

        public async Task<UpdateTenantResponse> UpdateAsync(Tenant tenant)
        {
            if (tenant is null)
            {
                return new UpdateTenantResponse {
                    Success = false,
                    Errors = new List<string>() { "Organization not found" }
                };
            }

            try
            {
                var vTenant = await _tenantRepository.UpdateAsync(tenant);
                var vTenantVm = _mapper.Map<TenantVm>(vTenant);
                return new UpdateTenantResponse
                {
                    Data = new UpdateTenantData { Id = vTenant.ID, Tenant = vTenantVm },
                    Success = true,
                    Message = "Organization updated successfully.",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateTenantResponse
                {
                    Success = false,
                    Message = ResponseMessage.FAILURE + " " + ex.Message,
                    StatusCode = 999,
                    Errors = new List<string> { "Oops! Something wrong updating Organization" }
                };
            }
        }

        public async Task<bool> GetAvailableTenantByName(string name)
        {
            var tenant = await _tenantRepository.GetTenantByNameAsync(name);
            return tenant != null;
        }

        public async Task<Tenant> GetTenantByNameStateCountry(string tenantName, string state, int countryId) => await _tenantRepository.GetTenantByNameStateCountry(tenantName, state, countryId);

        public async Task<bool> DeleteAsync(int id) => await _tenantRepository.DeleteAsync(id);
    }
}
