using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.VaccinationTypeResult;

namespace TYR.WEB.Models.Response.SAVaccinationTypeResult
{
    public class AddSAVaccinationTypeResponse: BaseOperationResult
    {
        public int Id { get; set; }
        public AddSAVaccinationTypeData Data { get; set; }
    }

    public class AddSAVaccinationTypeData
    {
        public int Id { get; set; }
    }
}
