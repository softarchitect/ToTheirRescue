using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
namespace TYR.WEB.Models.Response.AnimalResult
{
   public class AnimalwithMilestoneResponse: BaseOperationResult
    {
       
        public AnimalandMilestonedata Data { get; set; }
    }

    public class AnimalandMilestonedata
    {
        public List<AddAnimalData> AnimalDatas { get; set; }
        public List<AnimalwithMilestoneResponse> MilstoneData { get; set; }
    }
   
}
