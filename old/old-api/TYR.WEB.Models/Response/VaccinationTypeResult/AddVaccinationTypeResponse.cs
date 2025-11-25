using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VaccinationTypeResult
{
    public class AddVaccinationTypeResponse : BaseOperationResult
    {
        public int Id { get; set; }
        public AddVaccinationTypeData Data { get; set; }
    }

    public class AddVaccinationTypeData
    {
        public int Id { get; set; }
    }
}
