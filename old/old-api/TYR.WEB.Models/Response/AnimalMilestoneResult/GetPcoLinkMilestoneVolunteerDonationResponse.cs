using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalMilestoneResult
{
    public class GetPcoLinkMilestoneVolunteerDonationResponse: BaseOperationResult
    {
        public GetPcoLinkIntakeMilestoneData Data { get; set; }
    }
    public class GetPcoLinkIntakeMilestoneData
    {
        public bool Linked { get; set; }
    }
}
