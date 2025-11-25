using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.WEB.Models.Response.TenantResult
{
    public class GetTenantResponse: BaseOperationResult
    {
        public GetTenantData Data { get; set; }
    }

    public class GetTenantData
    {
        public int Id { get; set; }
        public CreateTenantVm Tenant { get; set; }
    }
}
