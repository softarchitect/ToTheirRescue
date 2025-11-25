using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Models.Response.DashBoardResult;
using TYR.WEB.Models.Response.AnimalResult;
using TYR.WEB.Models.Response.PCOResult;
using Microsoft.AspNetCore.Authorization;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/dashboard")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {

        private readonly IAnimalService _animalService;
        private readonly string _userName;
        private readonly IUserService _userService;
        private readonly IPCOService _pcoService;

        public DashBoardController(IHttpContextAccessor httpContextAccessor, IAnimalService animalServices, IMapper mapper, IUserService userService, IPCOService pcoService)
        {
            _animalService = animalServices;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
            _pcoService = pcoService;
        }

        [HttpGet]
        [Route("get-count")]
        public async Task<DashBoardCountResponse> GetCount()
        {
            try
            {
                var tenantId = await _userService.GetTenantIdByUserName(_userName);
                var animalCount = await _animalService.GetAnimalCountAsync(tenantId);
                var pcoCount = await _pcoService.GetPCOCount(tenantId);
                return new DashBoardCountResponse
                {
                    Data = new GetDashBoardCount
                    {
                        AnimalCount = new GetAnimalCount
                        {
                            FormarAnimalCount = animalCount.Data.FormarAnimalCount,
                            ResidentAnimalCount = animalCount.Data.ResidentAnimalCount
                        },
                        PCOCount = new GetPCOCount
                        {
                            OrganizationCount = pcoCount.Data.OrganizationCount,
                            PersonCount = pcoCount.Data.PersonCount
                        }
                    },
                    Success = true,
                    StatusCode = 200

                };
            }
            catch(Exception ex)
            {
                return new DashBoardCountResponse
                {
                    Errors = new List<string> { "OOPs Some thing went wrong in count", ex.InnerException.ToString()},
                    Success = false,
                    StatusCode = 200
                };
            }
        }


    }
}
