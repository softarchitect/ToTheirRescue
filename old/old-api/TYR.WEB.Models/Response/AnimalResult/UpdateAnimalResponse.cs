using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalViewModel;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class UpdateAnimalResponse : BaseOperationResult
    {
        public UpdateAnimalData Data { get; set; }
    }
    public class UpdateAnimalData
    {
        public int Id { get; set; }
        public AnimalAnimalTypeVm Animal { get; set; }
    }
}
