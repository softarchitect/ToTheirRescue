using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.TenantResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ITenantRepository: IRepositoryBase<Tenant>
    {
        Task<CreateTenantResponse> CreateTenantAsync(Tenant tenant);
        Task<Tenant> GetTenantByNameAsync(string tenantName);
        Task<List<Tenant>> GetAllTenantsAsync();
        Task<Tenant> GetTenantByNameStateCountry(string tenantName, string state, int countryId);
    }
}
