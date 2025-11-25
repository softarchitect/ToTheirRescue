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
    public class GetAnimalListResponse: BaseOperationResult
    {
        public GetAnimalListData Data { get; set; }
    }
    public class GetAnimalListData
    {
        //public List<Animal> Animals { get; set; }
        public List<AnimalAnimalTypeVm> AnimalAnimalTypeVms { get; set; }
        public List<ListAnimalResponse> AnimalList { get; set; }
    }
}
