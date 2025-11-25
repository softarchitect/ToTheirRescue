using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVaccinationTypeResult
{
    public class UpdateSAVaccinationTypeResponse: BaseOperationResult
    {
        public UpdateSAVaccinationTypeData Data { get; set; }
    }

    public class UpdateSAVaccinationTypeData
    {
        public int Id { get; set; }
        public SAVaccinationType SAVaccinationType { get; set; }
    }
}
