using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AttachmentResult
{
    public class GetAttachmentCountResponse : BaseOperationResult
    {
        public GetAttachmentCountData Data { get; set; }
    }
    public class GetAttachmentCountData
    {
        public int Count { get; set; }
        public List<ArtifactAttachment> ArtifactAttachments { get; set; }
    }
}
