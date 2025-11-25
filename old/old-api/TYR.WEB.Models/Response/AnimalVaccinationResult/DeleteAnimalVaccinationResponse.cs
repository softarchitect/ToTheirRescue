using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalVaccinationResult
{
    public class DeleteAnimalVaccinationResponse : BaseOperationResult
    {
        public DeleteAnimalVaccinationData Data { get; set; }
    }

    public class DeleteAnimalVaccinationData
    {
        public bool IsDeleted { get; set; }
    }
}
