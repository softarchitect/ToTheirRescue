using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SOAPResult
{
    public class AddSOAPResponse: BaseOperationResult
    {
        public AddSOAPData Data { get; set; }
    }

    public class AddSOAPData
    {
        //public List<SOAP> SOAPs { get; set; }
        public int Id { get; set; }
        public SOAP SOAP { get; set; }
    }

    public class AddSOAPListResponse : BaseOperationResult
    {
        public List<AddSOAPListData> Data { get; set; }
    }

    public class AddSOAPListData
    {
        public int AnimalId { get; set; }
        public int TenantId { get; set; }
        public SOAP SOAP { get; set; }
    }

}
