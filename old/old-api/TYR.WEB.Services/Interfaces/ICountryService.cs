using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.CountryResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ICountryService
    {
        Task<GetCountriesResponse> GetAllAsync();
        Task<GetCountryResponse> GetByIdAsync(int id);
    }
}
