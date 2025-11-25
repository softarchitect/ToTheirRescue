using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.ViewModels.UserRoleViewModel;
using TYR.WEB.Models.ViewModels.UserViewModel;

namespace TYR.WEB.Models.Mapping.UserRoleMapping
{
    public class UserRoleMap: Profile
    {
        public UserRoleMap() 
        {
            CreateMap<IdentityRole, UserRoleVm>();
            CreateMap<UserRoleVm, IdentityRole>();
        }
    }
}
