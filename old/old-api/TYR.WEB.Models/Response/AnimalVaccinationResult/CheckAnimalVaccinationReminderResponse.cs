using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalVaccinationResult
{
    public class CheckAnimalVaccinationReminderResponse: BaseOperationResult
    {
        public CheckAnimalVaccinationReminderData Data { get; set; }
    }

    public class CheckAnimalVaccinationReminderData
    {
        public bool IsReminderExist { get; set; }
    }
}
