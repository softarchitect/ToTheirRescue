using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.WEB.Models.Response.TenantResult
{
    public class UpdateTenantResponse: BaseOperationResult
    {
        public UpdateTenantData Data { get; set; }
    }

    public class UpdateTenantData
    {
        public int Id { get; set; }
        public TenantVm Tenant { get; set; }
    }
}
