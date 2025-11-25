using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DiaryResult
{
    /// <summary>
    /// AddDiaryResponse
    /// </summary>
    public class AddDiaryResponse: BaseOperationResult
    {
        public AddDiaryData Data { get; set; }
    }

    public class AddDiaryData
    {
        public int Id { get; set; }
        public Diary Diary { get; set; }
    }

    /// <summary>
    /// TenatOrAnimal Entity Type = Animal
    /// </summary>
    public class AddDiaryListResponse : BaseOperationResult
    {
        public List<AddDiaryListData> Data { get; set; }
    }

    public class AddDiaryListData
    {
        public int AnimalId { get; set; }
        public int TenantId { get; set; }
        public Diary Diary { get; set; }
    }

    ///// <summary>
    ///// TenatOrAnimal Entity Type = Tenant
    ///// </summary>
    //public class AddDiaryTenantListResponse : BaseOperationResult
    //{
    //    public List<AddDiaryListData> Data { get; set; }
    //}

    //public class AddDiaryTenantListData
    //{
    //    public int AnimalId { get; set; }
    //    public Diary Diary { get; set; }
    //}
}
