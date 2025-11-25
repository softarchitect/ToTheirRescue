using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DonationResult;
using TYR.WEB.Models.Response.MedResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IDonationRepository: IRepositoryBase<Donation>
    {
        Task<AddDonationResponse> AddDonationAsync(Donation donation);
        Task<DeleteDonationResponse> UpdateDonationByDeletedAsync(int id, bool isDeleted);
        Task<UpdateDonationResponse> UpdateDonationAsync(int id, Donation donation);
        Task<GetDonationResponse> GetDonationByPcoIdAsync(int pcoId, bool isDeleted, int tenantId);
    }
}
