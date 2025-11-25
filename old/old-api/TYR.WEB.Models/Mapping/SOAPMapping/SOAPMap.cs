using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.SOAPViewModel;

namespace TYR.WEB.Models.Mapping.SOAPMapping
{
    public class SOAPMap: Profile
    {
        public SOAPMap()
        {
            CreateMap<SOAPVm, SOAP>();
        }
    }
}
