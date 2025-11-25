using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.UserViewModel;
namespace TYR.WEB.Models.Mapping.ApplicationUserMapping
{
    public class ApplicationUserInviteMap: Profile
    {
        public ApplicationUserInviteMap()
        {
            CreateMap<InviteUserVm, ApplicationUser>();
            CreateMap<UpdateUserVm, ApplicationUser>();
            CreateMap<ApplicationUser, UsersVM>();
            CreateMap<Tenant, UserTenantVM>();
        }
    }
}
