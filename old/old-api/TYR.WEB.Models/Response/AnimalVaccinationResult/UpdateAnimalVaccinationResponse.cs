using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalVaccinationResult
{
    public class UpdateAnimalVaccinationResponse : BaseOperationResult
    {
        public UpdateAnimalVaccinationData Data { get; set; }
    }

    public class UpdateAnimalVaccinationData
    {
        public int Id { get; set; }
        public AnimalVaccination AnimalVaccination { get; set; }
    }
}
