using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VaccinationTypeResult
{
    public class DeleteVaccinationTypeResponse : BaseOperationResult
    {
        public DeleteVaccinationTypeData Data { get; set; }
    }

    public class DeleteVaccinationTypeData
    {
        public bool IsDeleted { get; set; }
    }
}
