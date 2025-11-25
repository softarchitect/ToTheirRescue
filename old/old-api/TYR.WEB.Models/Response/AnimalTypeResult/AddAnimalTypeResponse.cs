using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalTypeResult
{
    public class AddAnimalTypeResponse: BaseOperationResult
    {
        public AddAnimalTypeData Data { get; set; }
    }

    public class AddAnimalTypeData
    {
        public int Id { get; set; }
    }
}
