using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthNoteResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IHealthNoteService
    {
        Task<AddHealthNoteResponse> AddHealthNoteAsync(HealthNote healthNote);
        Task<DeleteHealthNoteResponse> UpdateHealthNoteByDeletedAsync(int id, bool isDeleted);
        Task<UpdateHealthNoteResponse> UpdateHealthNoteAsync(int id, HealthNote healthNote);
        Task<GetHealthNoteResponse> GetHealthNoteByAnimalIdAsync(int animalId, bool isDeleted, int tenantId);
        //Task<GetHealthNoteResponse> GetHealthNoteByTenantIdAsync(bool isDeleted, int tenantId);
        Task<HealthNote> GetHealthNoteByIdAsync(int id);
    }
}
