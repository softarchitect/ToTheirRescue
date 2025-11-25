using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VaccinationTypeResult
{
    public class GetAvailableVaccinationTypesResponse : BaseOperationResult
    {
        public GetAvailableVaccinationTypesData Data { get; set; }
    }

    public class GetAvailableVaccinationTypesData
    {
        public bool IsAvailable { get; set; }
    }
}
