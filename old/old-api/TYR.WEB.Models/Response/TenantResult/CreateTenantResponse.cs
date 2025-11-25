using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.TenantResult
{
    public class CreateTenantResponse: BaseOperationResult
    {
        public CreateTenantData Data { get; set; }
    }

    public class CreateTenantData
    {
        public int Id { get; set; }
        public Tenant Tenant { get; set; }
    }
}
