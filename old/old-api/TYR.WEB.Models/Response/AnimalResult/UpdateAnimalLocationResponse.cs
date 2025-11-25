using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class UpdateAnimalLocationResponse: BaseOperationResult
    {
        public UpdateAnimalLocationData Data { get; set; }
    }

    public class UpdateAnimalLocationData
    {
        public bool Result { get; set; }
    }
}
