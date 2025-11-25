using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.PCO;
namespace TYR.WEB.Models.Response.PCOResult
{
   public class GetPcoListPageResponse : BaseOperationResult
    {

        public PCOPageData Data { get; set; }
    }
    public class PCOPageData 
    {
        public int CurrentPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPage { get; set; }
        public bool NextPage { get; set; }
        public bool PrevPage { get; set; }
        public List<PCOListVm> PCOList { get; set; }

       
    }

}
