using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalTypeResult
{
    public class DeleteAnimalTypeResponse: BaseOperationResult
    {
        public DeleteAnimalTypeData Data { get; set; }
    }

    public class DeleteAnimalTypeData
    {
        public bool IsDeleted { get; set; }
    }
}
