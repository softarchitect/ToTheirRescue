using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.CountryResult
{
    public class GetCountryResponse: BaseOperationResult
    {
        public GetCountryData Data { get; set; }
    }

    public class GetCountryData
    {
        public Country Country { get; set; }
    }
}
