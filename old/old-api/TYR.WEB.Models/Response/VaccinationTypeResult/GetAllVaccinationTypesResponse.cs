using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VaccinationTypeResult
{
    public class GetAllVaccinationTypesResponse : BaseOperationResult
    {
        public GetAllVaccinationTypesData Data { get; set; }
    }
    public class GetAllVaccinationTypesData
    {
        public List<VaccinationType> VaccinationTypes { get; set; }
    }
}
