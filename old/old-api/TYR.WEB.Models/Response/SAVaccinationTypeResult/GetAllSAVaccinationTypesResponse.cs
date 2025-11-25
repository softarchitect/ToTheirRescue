using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVaccinationTypeResult
{
    public class GetAllSAVaccinationTypesResponse: BaseOperationResult
    {
        public GetAllSAVaccinationTypesData Data { get; set; }
    }

    public class GetAllSAVaccinationTypesData
    {
        public List<SAVaccinationType> SAVaccinationTypes { get; set; }
    }
}
