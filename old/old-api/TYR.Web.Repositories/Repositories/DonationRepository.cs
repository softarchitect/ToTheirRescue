using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DonationResult;
using TYR.WEB.Models.Response.MedResult;

namespace TYR.Web.Repositories.Repositories
{
    public class DonationRepository : RepositoryBase<Donation>, IDonationRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public DonationRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }
        public async Task<AddDonationResponse> AddDonationAsync(Donation donation)
        {
            try
            {
                var vDonation = await base.AddAsync(donation);
                await _dbContext.SaveChangesAsync();

                return new AddDonationResponse
                {
                    Data = new AddDonationData { Id = vDonation.Id, Donation = vDonation },
                    Message = "Donation added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddDonationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding donation record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetDonationResponse> GetDonationByPcoIdAsync(int pcoId, bool isDeleted, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstDonations = from d in _dbContext.Donations
                              select new DonationCustom
                              {
                                  Id = d.Id,
                                  PcoId = d.PcoId ?? 0,
                                  PcoName = d.PcoId.HasValue ? (_dbContext.PCOs.Where(p => p.Id.Equals(d.PcoId.Value)).FirstOrDefault().FirstName + " " + _dbContext.PCOs.Where(p => p.Id.Equals(d.PcoId.Value)).FirstOrDefault().LastName) : string.Empty,
                                  DonationDate = d.DonationDate ?? dtDate,
                                  Amount = d.Amount ?? 0.0,
                                  DonationType = d.DonationType,
                                  Notes = d.Notes,
                                  IsDeleted = d.IsDeleted,
                                  TenantId = d.TenantId
                              };
                var lst = await lstDonations
                                .Where(a => a.PcoId.Equals(pcoId) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.DonationDate).ToListAsync().ConfigureAwait(false);
                var totalCount = lst.Sum(d => d.Amount ?? 0);
                return new GetDonationResponse
                {
                    Data = new GetDonationData { Donations = lst, TotalCount = totalCount },
                    Message = "Donations record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetDonationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting donation record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateDonationResponse> UpdateDonationAsync(int id, Donation donation)
        {
            try
            {
                var _donation = await FindAsync(m => m.Id.Equals(id));
                _donation.DonationDate = donation.DonationDate ?? _donation.DonationDate;
                _donation.Amount = donation.Amount ?? _donation.Amount;
                _donation.DonationType = string.IsNullOrEmpty(donation.DonationType) ? _donation.DonationType : donation.DonationType;
                _donation.Notes = donation.Notes ?? _donation.Notes;
                _donation.DateModified = DateTime.Now;
                _donation.ModifiedBy = _userName;
                _donation.IsDeleted = false;

                var entity = await base.UpdateAsync(_donation);
                await _dbContext.SaveChangesAsync();

                return new UpdateDonationResponse()
                {
                    Success = true,
                    Data = new UpdateDonationData { Id = entity.Id, Donation = entity },
                    Message = "Donation updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateDonationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating donation record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteDonationResponse> UpdateDonationByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var _donation = await FindAsync(d => d.Id.Equals(id));
                if (_donation != null)
                {
                    _donation.IsDeleted = isDeleted;
                    _donation.DateModified = DateTime.Now;
                    _donation.ModifiedBy = _userName;

                    var med = await UpdateAsync(_donation);
                    _dbContext.SaveChanges();
                    return new DeleteDonationResponse
                    {
                        Data = new DeleteDonationData
                        {
                            IsDeleted = med.IsDeleted
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Donation deleted sucessfully!"
                    };
                }
                else
                {
                    return new DeleteDonationResponse
                    {
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Donation not found."
                    };
                }
            }
            catch (Exception ex)
            {
                return new DeleteDonationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating donation record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
