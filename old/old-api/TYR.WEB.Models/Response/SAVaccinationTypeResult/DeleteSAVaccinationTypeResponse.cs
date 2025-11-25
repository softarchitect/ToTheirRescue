using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.VaccinationTypeResult;

namespace TYR.WEB.Models.Response.SAVaccinationTypeResult
{
    public class DeleteSAVaccinationTypeResponse: BaseOperationResult
    {
        public DeleteSAVaccinationTypeData Data { get; set; }
    }

    public class DeleteSAVaccinationTypeData
    {
        public bool IsDeleted { get; set; }
    }
}
