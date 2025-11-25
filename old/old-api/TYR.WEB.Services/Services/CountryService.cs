using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.CountryResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class CountryService : ICountryService
    {
        private readonly ICountryRepository _countryRepository;
        public CountryService(ICountryRepository countryRepository) => _countryRepository = countryRepository;
        public async Task<GetCountriesResponse> GetAllAsync()
        {
            try
            {
                var lstCountries = await _countryRepository.GetAllAsync();
                var lstCountriesOrdered = lstCountries.OrderBy(c => c.CountryName).ToList();
                return new GetCountriesResponse
                {
                    Data = new GetCountriesData { Countries = lstCountriesOrdered },
                    Message = "Countries retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetCountriesResponse { Success = false, StatusCode = 400, Errors = new List<string> { "Oops! Something wrong. Countries not retrieved" } };
            }
            
        }

        public async Task<GetCountryResponse> GetByIdAsync(int id)
        {
            try
            {
                var vCountry = await _countryRepository.GetByIdAsync(id);
                return new GetCountryResponse
                {
                    Data = new GetCountryData { Country = vCountry },
                    Message = "Country retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetCountryResponse { Success = false, StatusCode = 400, Errors = new List<string> { "Oops! Something wrong. Country not retrieved" } };
            }
            
        }
    }
}
