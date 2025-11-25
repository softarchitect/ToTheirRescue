using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.CountryResult
{
    public class GetCountriesResponse: BaseOperationResult
    {
        public GetCountriesData Data { get; set; }
    }

    public class GetCountriesData
    {
        public List<Country> Countries { get; set; }
    }
}
