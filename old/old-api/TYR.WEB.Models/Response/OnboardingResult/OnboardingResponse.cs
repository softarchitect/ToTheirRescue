using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.PCOResult;

namespace TYR.WEB.Models.Response.OnboardingResult
{
    public class OnboardingResponse: BaseOperationResult
    {
        public OnboardingData Data { get; set; }
    }
    public class OnboardingData
    {
        public List<AnimalType> AnimalTypes { get; set; }
        public List<PCOCustom> Otherrescues { get; set; }
        public List<PCOCustom> Hospitals { get; set; }

    }
}
