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
    public class AddMultipleAnimalResponse : BaseOperationResult 
    {
        public List<AnimalIds> Data { get; set; }
    }
    public class AnimalIds
    {
        public int Id { get; set; }
        public Animal Animal { get; set; }
        public int BirthMilestoneId { get; set; }
        public AnimalMilestone BirthAnimalMilestone { get; set; }
        public int IntakeMilestoneId { get; set; }
        public AnimalMilestone IntakeAnimalMilestone { get; set; }
        public List<ListAnimalResponse> AnimalList { get; set; }
    }
    
}
