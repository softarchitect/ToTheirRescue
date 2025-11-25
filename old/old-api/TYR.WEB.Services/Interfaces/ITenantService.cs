using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.TenantResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.WEB.Services.Interfaces
{
    public interface ITenantService
    {
        Task<CreateTenantResponse> CreateTenantAsync(Tenant tenant);
        Task<Tenant> GetTenantByNameAsync(string name);
        Task<Tenant> GetTenantbyIdAsync(int id);
        Task<UpdateTenantResponse> UpdateAsync(Tenant tenant);
        Task<bool> GetAvailableTenantByName(string name);
        Task<Tenant> GetTenantByNameStateCountry(string tenantName, string state, int countryId);
        Task<bool> DeleteAsync(int id);
    }
}
