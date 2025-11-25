using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.AnimalViewModel;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class AddAnimalResponse : BaseOperationResult
    {
        public AddAnimalData Data { get; set; }
    }
    public class AddAnimalData
    {
        public int Id { get; set; }
        public Animal Animal { get; set; }
        public List<AnimalAnimalTypeVm> AnimalAnimalTypeVms { get; set; }
        
    }
}
