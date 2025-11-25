using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.CountryResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    //[Authorize]
    [Route("api/country")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;
        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]
        [Route("get-country")]
        public async Task<IActionResult> GetCountries()
        {
            var result = await _countryService.GetAllAsync();
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        [HttpGet]
        [Route("get-country/{id}")]
        public async Task<IActionResult> GetCountryById(int id)
        {
            if(id <= 0)
            {
                return BadRequest(new GetCountryResponse
                {
                    Success = false,
                    Errors = new List<string> { "Country identifier should be greater than 0" }
                });
            }

            var result = await _countryService.GetByIdAsync(id);
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }
    }
}
