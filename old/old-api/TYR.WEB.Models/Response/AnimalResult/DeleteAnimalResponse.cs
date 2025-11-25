using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
   public class DeleteAnimalResponse : BaseOperationResult
    {
        public DeleteAnimal Data { get; set; }
    }
    public class DeleteAnimal
    {
        public bool IsDeleted { get; set; }
    }
}
