using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;

namespace TYR.Web.Repositories.Repositories
{
    public class MedicineRepository : RepositoryBase<Medicine>, IMedicineRepository
    {
        public MedicineRepository(TYRDbContext dbContext) : base(dbContext) { }

        public async Task<AddMedicineResponse> AddMedicineAsync(Medicine t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddMedicineResponse
                {
                    Data = new AddMedicineData { Id = t.Id },
                    Message = "Medicine added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new AddMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableMedicineResponse> AvailableMedicines(bool isDeleted, string medicineName, int tenantId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.MedicineName.Equals(medicineName) && a.TenantId.Equals(tenantId));
                if (type != null)
                {
                    return (new GetAvailableMedicineResponse
                    {
                        Success = true,
                        Data = new GetAvailableMedicinesData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Medicine already exists."
                    });
                }
                else
                {
                    return (new GetAvailableMedicineResponse
                    {
                        Success = true,
                        Data = new GetAvailableMedicinesData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Medicine available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetMedicineResponse> GetAllMedicinesAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstMedicine = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstMedicineOrdered = lstMedicine.OrderBy(a => a.MedicineName).ToList<Medicine>();
                return new GetMedicineResponse
                {
                    Data = new GetMedicinesData { Medicines = lstMedicineOrdered },
                    Message = "Medicine retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateMedicineResponse> UpdateMedicineAsync(Medicine t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateMedicineResponse()
                {
                    Success = true,
                    Data = new UpdateMedicineData { Id = entity.Id, Medicine = entity },
                    Message = "Medicine updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while  updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteMedicineResponse> UpdateMedicineByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vMedicine = await GetByIdAsync(id);
                if (vMedicine == null)
                    return new DeleteMedicineResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vMedicine.IsDeleted = isDeleted;
                await UpdateAsync(vMedicine);
                await _context.SaveChangesAsync();
                return new DeleteMedicineResponse()
                {
                    Success = true,
                    Data = new DeleteMedicineData { IsDeleted = true },
                    Message = "Medicine deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteMedicineResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
