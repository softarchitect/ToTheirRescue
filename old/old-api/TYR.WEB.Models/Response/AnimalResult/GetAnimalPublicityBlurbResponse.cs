using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class GetAnimalPublicityBlurbResponse: BaseOperationResult
    {
        public GetAnimalPublicityBlurbData Data { get; set; }
    }

    public class GetAnimalPublicityBlurbData
    {
        public string PublicityBlurb { get; set; }
    }
}
