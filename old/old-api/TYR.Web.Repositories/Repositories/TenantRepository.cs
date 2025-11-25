using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.TenantResult;
using System.Linq.Expressions;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using TYR.WEB.Models.Constants;

namespace TYR.Web.Repositories.Repositories
{
    public class TenantRepository: RepositoryBase<Tenant>, ITenantRepository
    {
        public TenantRepository(TYRDbContext dbContext) : base(dbContext) { }

        public async Task<CreateTenantResponse> CreateTenantAsync(Tenant tenant)
        {
            var result = new CreateTenantResponse();
            try
            {
                var vTenant = await base.AddAsync(tenant);
                result = new CreateTenantResponse
                {
                    Data = new CreateTenantData { Id = vTenant.ID, Tenant = vTenant },
                    Success = true,
                    Message = ResponseMessage.SUCCESS,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                result = new CreateTenantResponse
                {
                    Success = false,
                    Message = ResponseMessage.FAILURE + " " + ex.Message,
                    StatusCode = 999,
                    Errors = new List<string> { "Oops! Something went wrong while creating rescue" }
                };
            }
            return result;
        }

        public async Task<List<Tenant>> GetAllTenantsAsync() => await base.GetAllAsync();

        public async Task<Tenant> GetTenantByNameAsync(string tenantName) => await base.FindAsync(t => t.Name.Equals(tenantName));

        public async override Task<Tenant> UpdateAsync(Tenant t)
        {
            
            await base.UpdateAsync(t);
            await _context.SaveChangesAsync();
            return t;
        }

        public async Task<Tenant> GetTenantByNameStateCountry(string tenantName, string state, int countryId)
        {
            return await base.FindAsync(t => t.Name.Equals(tenantName) && t.State.Equals(state) && t.CountryId.Equals(countryId));
        }

    }
}
