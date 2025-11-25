using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AttachmentViewModel;

namespace TYR.WEB.Models.Mapping.AttachmentMapping
{
    public class AttachmentMap : Profile
    {
        public AttachmentMap()
        {
            CreateMap<AttachmentVm, ArtifactAttachment>();
            CreateMap<AddAttachmentVm, ArtifactAttachment>();
            CreateMap<AddMulipleAttachmentVm, ArtifactAttachment>();
        }
    }
}
