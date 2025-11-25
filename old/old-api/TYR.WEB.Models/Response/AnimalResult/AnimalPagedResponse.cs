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
    public class AnimalPagedResponse : BaseOperationResult
    {
        public AnimalPageData Data { get; set; }
    }
    public class AnimalPageData
    {
        public int CurrentPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPage { get; set; }
        public bool NextPage { get; set; }
        public bool PrevPage { get; set; }
        public List<AnimalAnimalTypeVm> Animals { get; set; }
        public List<ListAnimalResponse> AnimalsList { get; set; }

    }
}
