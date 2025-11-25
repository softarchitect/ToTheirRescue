using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class UpdateAnimalPublicityBlurbResponse: BaseOperationResult
    {
        public UpdateAnimalPublicityBlurbData Data { get; set; }
    }

    public class UpdateAnimalPublicityBlurbData
    {
        public bool Result { get; set; }
    }
}
