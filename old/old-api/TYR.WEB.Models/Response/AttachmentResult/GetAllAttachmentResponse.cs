using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AttachmentResult
{
    public class GetAllAttachmentResponse : BaseOperationResult
    {
        public GetAttachmentsData Data { get; set; }
    }

    public class GetAttachmentsData
    {
        public List<ArtifactAttachment> ArtifactAttachments { get; set; }
    }
}
