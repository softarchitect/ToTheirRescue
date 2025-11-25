using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Models.Response.SAMedicineResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class SAMedicineRepository : RepositoryBase<SAMedicine>, ISAMedicineRepository
    {
        public SAMedicineRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddSAMedicineResponse> AddSAMedicineAsync(SAMedicine t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddSAMedicineResponse
                {
                    Data = new AddSAMedicineData { Id = t.Id },
                    Message = "Medicine added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new AddSAMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableSAMedicineResponse> AvailableSAMedicinesAsync(bool isDeleted, string medicineName)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.MedicineName.Equals(medicineName));
                if (type != null)
                {
                    return (new GetAvailableSAMedicineResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAMedicineData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Medicine already exists."
                    });
                }
                else
                {
                    return (new GetAvailableSAMedicineResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAMedicineData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Medicine available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableSAMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetSAMedicineResponse> GetAllSAMedicinesAsync(bool isDeleted)
        {
            try
            {
                var lstSAMedicine = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted));
                var lstSAMedicineOrdered = lstSAMedicine.OrderBy(a => a.MedicineName).ToList<SAMedicine>();
                return new GetSAMedicineResponse
                {
                    Data = new GetSAMedicinesData { Medicines = lstSAMedicineOrdered },
                    Message = "Medicine retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetSAMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateSAMedicineResponse> UpdateSAMedicineAsync(SAMedicine t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateSAMedicineResponse()
                {
                    Success = true,
                    Data = new UpdateSAMedicineData { Id = entity.Id, SAMedicine = entity },
                    Message = "Medicine updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateSAMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while  updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteSAMedicineResponse> UpdateSAMedicineByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vMedicine = await GetByIdAsync(id);
                if (vMedicine == null)
                    return new DeleteSAMedicineResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vMedicine.IsDeleted = isDeleted;
                await UpdateAsync(vMedicine);
                await _context.SaveChangesAsync();
                return new DeleteSAMedicineResponse()
                {
                    Success = true,
                    Data = new DeleteSAMedicineData { IsDeleted = true },
                    Message = "Medicine deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteSAMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
