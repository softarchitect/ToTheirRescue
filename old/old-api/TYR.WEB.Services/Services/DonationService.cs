using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DonationResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class DonationService : IDonationService
    {
        private readonly IDonationRepository _donationRepository;
        public DonationService(IDonationRepository donationRepository) => _donationRepository = donationRepository;
        public async Task<AddDonationResponse> AddDonationAsync(Donation donation) => await _donationRepository.AddDonationAsync(donation);

        public async Task<Donation> GetDonationByIdAsync(int id) => await _donationRepository.GetByIdAsync(id);

        public async Task<GetDonationResponse> GetDonationByPcoIdAsync(int pcoId, bool isDeleted, int tenantId) => await _donationRepository.GetDonationByPcoIdAsync(pcoId, isDeleted, tenantId);

        public async Task<UpdateDonationResponse> UpdateDonationAsync(int id, Donation donation) => await _donationRepository.UpdateDonationAsync(id, donation);

        public async Task<DeleteDonationResponse> UpdateDonationByDeletedAsync(int id, bool isDeleted) => await _donationRepository.UpdateDonationByDeletedAsync(id, isDeleted);
    }
}
