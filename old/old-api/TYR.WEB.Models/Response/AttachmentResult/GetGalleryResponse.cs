using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AttachmentResult
{
    public class GetGalleryResponse: BaseOperationResult
    {
        public GetGalleryData Data { get; set; }
    }
    public class GetGalleryData
    {
        public int Count { get; set; }
        public List<Gallery> Gallery { get; set; }

    }

    public class Gallery
    {
        public int AnimalId { get; set; }
        public int AnimalTypeId { get; set; }
        public string AnimalTypeName { get; set; }
        public string AnimalName { get; set; }
        public string ImageName { get; set; }
        public string OriginalBlobUrl { get; set; }
        public string BlobUrl { get; set; }
        public string ThumbnailBlobUrl { get; set; }
        public int PublicityRank { get; set; }
        public bool CurrentResident { get; set; }
        public string Status { get; set; }
    }
}
