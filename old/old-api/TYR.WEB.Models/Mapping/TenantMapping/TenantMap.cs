using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.WEB.Models.Mapping.TenantMapping
{
    public class TenantMap: Profile
    {
        public TenantMap()
        {
            CreateMap<CreateTenantVm, Tenant>();
            CreateMap<Tenant, CreateTenantVm>();
            CreateMap<TenantVm, Tenant>();
            CreateMap<Tenant, TenantVm>();
        }
    }
}
