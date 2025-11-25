using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class UpdateAnimalDietResponse: BaseOperationResult
    {
        public UpdateAnimalDietData Data { get; set; }
    }

    public class UpdateAnimalDietData
    {
        public bool Result { get; set; }
    }
}
