using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.DataAccess.SeedData
{
    public class AcquisitionWaySeed
    {
        public async Task<List<AcquisitionWay>> AddAcquisitionWayList(string userName, int tenantId)
        {
            var lstWays = new List<AcquisitionWay>();
            lstWays.Add(new AcquisitionWay { AcquisitionWayName = "Other Rescue/Shelter/Sanctuary", DateEntered = DateTime.Now, EnteredBy = userName, IsDeleted = false, IsNotEditable = true, TenantId = tenantId });
            lstWays.Add(new AcquisitionWay { AcquisitionWayName = "Owner Surrender", DateEntered = DateTime.Now, EnteredBy = userName, IsDeleted = false, IsNotEditable = true, TenantId = tenantId });
            lstWays.Add(new AcquisitionWay { AcquisitionWayName = "Born at Rescue", DateEntered = DateTime.Now, EnteredBy = userName, IsDeleted = false, IsNotEditable = true, TenantId = tenantId });
            lstWays.Add(new AcquisitionWay { AcquisitionWayName = "Public Surrender", DateEntered = DateTime.Now, EnteredBy = userName, IsDeleted = false, IsNotEditable = true, TenantId = tenantId });
            return await Task.FromResult(lstWays);
        }
    }


}
