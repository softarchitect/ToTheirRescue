using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VaccinationTypeResult
{
    public class UpdateVaccinationTypeResponse : BaseOperationResult
    {
        public UpdateVaccinationTypeData Data { get; set; }
    }

    public class UpdateVaccinationTypeData
    {
        public int Id { get; set; }
        public VaccinationType vaccinationType { get; set; }
    }
}
