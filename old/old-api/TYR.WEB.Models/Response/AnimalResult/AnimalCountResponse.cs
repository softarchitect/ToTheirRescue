using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class AnimalCountResponse : BaseOperationResult
    {
        public GetAnimalCount Data { get; set; }

    }
    public class GetAnimalCount
    {
        public int ResidentAnimalCount { get; set; }
        public int FormarAnimalCount { get; set; }
    }
}
