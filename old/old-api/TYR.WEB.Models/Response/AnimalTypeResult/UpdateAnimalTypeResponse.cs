using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalTypeResult
{
    public class UpdateAnimalTypeResponse : BaseOperationResult
    {
        public UpdateAnimalTypeData Data { get; set; }
    }

    public class UpdateAnimalTypeData
    {
        public int Id { get; set; }
        public AnimalType AnimalType { get; set; }
    }
}
