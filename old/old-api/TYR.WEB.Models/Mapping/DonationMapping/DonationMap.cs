using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.DonationViewModel;

namespace TYR.WEB.Models.Mapping.DonationMapping
{
    public class DonationMap: Profile
    {
        public DonationMap()
        {
            CreateMap<DonationVm, Donation>();
        }
    }
}
