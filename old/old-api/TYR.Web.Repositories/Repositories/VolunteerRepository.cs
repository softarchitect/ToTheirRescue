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
using TYR.WEB.Models.Response.VolunteerResult;

namespace TYR.Web.Repositories.Repositories
{
    public class VolunteerRepository: RepositoryBase<Volunteer>, IVolunteerRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        private readonly IVolunteerPersonActivityRepository _volunteerPersonActivityRepository;
        public VolunteerRepository(TYRDbContext dbContext, 
                                   IVolunteerPersonActivityRepository volunteerPersonActivityRepository, 
                                   IHttpContextAccessor httpContextAccessor) : base(dbContext) 
        { 
            _dbContext = dbContext;
            _volunteerPersonActivityRepository = volunteerPersonActivityRepository;
            _userName = httpContextAccessor?.HttpContext?.User?.Identity?.Name;
        }

        public async Task<UpsertVolunteerResponse> UpsertVolunteerAsync(Volunteer volunteer, List<VolunteerPersonActivity> volunteerPersonActivities)
        {
            try
            {
                // Add/Update Volunteer
                var vVolunteer = new Volunteer();
                
                var volunteerEntity = await (
                                        from v in _dbContext.Volunteers
                                        join p in _dbContext.PCOs on v.PcoId equals p.Id into pcoGroup
                                        from pco in pcoGroup.DefaultIfEmpty() // Left join to handle null PCOs
                                        where v.TenantId == volunteer.TenantId
                                              && v.PcoId == volunteer.PcoId
                                              && (pco == null || !pco.IsDeleted) // Ensure PCO is not deleted
                                              && !v.IsDeleted // Ensure Volunteer is not deleted
                                        orderby v.Id select new Volunteer 
                                        { 
                                            Id = v.Id,
                                            Active = v.Active,
                                            DateActive = v.DateActive,
                                            DateEntered = v.DateEntered,
                                            DateInactive = v.DateInactive,
                                            DateModified = v.DateModified,
                                            EnteredBy = v.EnteredBy,
                                            IsDeleted = v.IsDeleted,
                                            ModifiedBy = v.EnteredBy,
                                            Notes = v.Notes,
                                            PcoId = v.PcoId,
                                            TenantId = v.TenantId
                                        }).FirstOrDefaultAsync().ConfigureAwait(false);

                if (volunteerEntity != null)
                {
                    //volunteer.ModifiedBy = _userName;
                    //volunteer.DateModified = DateTime.Now;
                    volunteerEntity.DateActive = volunteer.DateActive;
                    volunteerEntity.ModifiedBy = _userName;
                    volunteerEntity.DateModified = DateTime.Now;
                    volunteerEntity.Active = volunteer.Active;
                    volunteerEntity.DateInactive = volunteer.DateInactive;
                    volunteerEntity.Notes = volunteer.Notes;

                    // Update Volunteer
                    vVolunteer = await base.UpdateAsync(volunteerEntity);
                    await _dbContext.SaveChangesAsync().ConfigureAwait(false);
                }
                else
                {
                    volunteer.EnteredBy = _userName;
                    volunteer.DateEntered = DateTime.Now;
                    // Add
                    vVolunteer = await base.AddAsync(volunteer);
                }

                var lstVolunteerPersonActivities = new List<VolunteerPersonActivity>();

                var tenantId = volunteer?.TenantId ?? 0;

                // Convert activity IDs into a list of tuples for better handling
                var activityIds = volunteerPersonActivities
                    .Where(a => a.PcoId.HasValue && a.VolunteerActivityId.HasValue) // Ensure values are not null
                    .Select(a => new { PcoId = a.PcoId.Value, VolunteerActivityId = a.VolunteerActivityId.Value, TenantId = tenantId })
                    .ToList();

                var existingActivities = new List<VolunteerPersonActivity>();
                if (activityIds == null || !activityIds.Any())
                {
                    existingActivities = new List<VolunteerPersonActivity>(); // Return empty list if no activity IDs exist
                }
                else
                {
                    // Extract PcoId, VolunteerActivityId, and TenantId as separate lists for better query performance
                    var pcoIds = activityIds.Select(a => a.PcoId).Distinct().ToList();
                    var volunteerActivityIds = activityIds.Select(a => a.VolunteerActivityId).Distinct().ToList();
                    var tenantIds = activityIds.Select(a => a.TenantId).Distinct().ToList();

                    // Ensure lists are not empty before querying the database
                    if (!pcoIds.Any() || !volunteerActivityIds.Any() || !tenantIds.Any())
                    {
                        existingActivities = new List<VolunteerPersonActivity>();
                    }

                    // Fetch all matching records in one optimized query
                    existingActivities = await _dbContext.VolunteerPersonActivities
                        .Where(vpa => pcoIds.Contains(vpa.PcoId ?? 0) // Handle null PcoId values
                                   && volunteerActivityIds.Contains(vpa.VolunteerActivityId ?? 0) // Handle null VolunteerActivityId values
                                   && tenantIds.Contains(vpa.TenantId ?? 0)) // Handle null TenantId values
                        .ToListAsync();
                }

                
                // Process each activity
                foreach (var activity in volunteerPersonActivities)
                {
                    var vPersonActivity = existingActivities.FirstOrDefault(vpa =>
                                                                            vpa.PcoId == activity.PcoId &&
                                                                            vpa.VolunteerActivityId == activity.VolunteerActivityId &&
                                                                            vpa.TenantId == volunteer.TenantId);

                    if (vPersonActivity != null)
                    {
                        // Update record
                        vPersonActivity.DateModified = DateTime.Now; // Use UtcNow for consistency
                        vPersonActivity.IsDeleted = false;
                        vPersonActivity.VolunteerActivityId = activity.VolunteerActivityId;
                        vPersonActivity.ModifiedBy = _userName;

                        // No need to await inside the loop, defer SaveChanges to the end
                        //await base.UpdateAsync(vPersonActivity);

                        var personActivityEntity = await _volunteerPersonActivityRepository.UpdateAsync(vPersonActivity);
                        lstVolunteerPersonActivities.Add(personActivityEntity);
                    }
                    else
                    {
                        activity.DateEntered = DateTime.Now; // Use UtcNow
                        activity.EnteredBy = _userName;
                        // Add new record
                        var vVolunteerPersonActivity = await _volunteerPersonActivityRepository.AddVolunteerPersonActivityAsync(activity);

                        if (vVolunteerPersonActivity?.Success == true && vVolunteerPersonActivity.Data?.VolunteerPersonActivity != null)
                        {
                            lstVolunteerPersonActivities.Add(vVolunteerPersonActivity.Data.VolunteerPersonActivity);
                        }
                    }
                }

                // Fetch all active VolunteerPersonActivities in one go
                var lstPersonActivities = await _dbContext.VolunteerPersonActivities
                                                .Where(vpa => vpa.PcoId == volunteer.PcoId && !vpa.IsDeleted && vpa.TenantId == volunteer.TenantId)
                                                .ToListAsync().ConfigureAwait(false);

                // Get the set of volunteerPersonActivity IDs for faster lookup
                var validVolunteerActivityIds = new HashSet<int>(lstVolunteerPersonActivities.Select(vpa => vpa.Id));

                // Identify activities to delete
                var activitiesToDelete = lstPersonActivities
                                            .Where(personActivity => !validVolunteerActivityIds.Contains(personActivity.Id))
                                            .ToList();

                // Mark them as deleted
                foreach (var personActivity in activitiesToDelete)
                {
                    personActivity.IsDeleted = true;
                    personActivity.DateModified = DateTime.Now;
                    personActivity.ModifiedBy = _userName;
                }

                // Perform batch update
                if (activitiesToDelete.Any())
                {
                    await _volunteerPersonActivityRepository.UpdateVolunteerPersonActivitiesAsync(activitiesToDelete);
                    
                }
                await _dbContext.SaveChangesAsync().ConfigureAwait(false);

                return new UpsertVolunteerResponse
                {
                    Data = new UpsertVolunteerData { Volunteer = vVolunteer, VolunteerPersonActivities = lstVolunteerPersonActivities },
                    Message = "Volunteer person activities upserted successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new UpsertVolunteerResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while upsert record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetVolunteersResponse> GetVolunteersByPcoIdAsync(int pcoId, int tenantId)
        {
            try
            {
                var vVolunteer = await (
                                        from v in _dbContext.Volunteers
                                        join vpa in _dbContext.VolunteerPersonActivities on v.PcoId equals vpa.PcoId
                                        join p in _dbContext.PCOs on v.PcoId equals p.Id into pcoGroup
                                        from pco in pcoGroup.DefaultIfEmpty() // Left join to handle null PCOs
                                        where v.TenantId == tenantId
                                              && v.PcoId == pcoId
                                              && (pco == null || !pco.IsDeleted) // Ensure PCO is not deleted
                                              && !v.IsDeleted // Ensure Volunteer is not deleted
                                        orderby v.Id
                                        select new VolunteerPersonCustom
                                        {
                                            VolunteerId = v.Id,
                                            VolunteerPersonActivityId = vpa.Id,
                                            DateActive = v.DateActive,
                                            DateInactive = v.DateInactive,
                                            Active = v.Active,
                                            Notes = v.Notes,
                                            PcoId = v.PcoId ?? 0, // Null-coalescing operator for cleaner code
                                            IsPcoDeleted = pco != null && pco.IsDeleted, // Avoids multiple DB calls
                                            IsVolunteerDeleted = v.IsDeleted,
                                            TenantId = v.TenantId ?? 0
                                        }).FirstOrDefaultAsync().ConfigureAwait(false);

                var lstVolunteerActivities = await (
                                                    from vpa in _dbContext.VolunteerPersonActivities
                                                    join va in _dbContext.VolunteerActivities on vpa.VolunteerActivityId equals va.Id
                                                    join p in _dbContext.PCOs on vpa.PcoId equals p.Id into pcoGroup
                                                    from pco in pcoGroup.DefaultIfEmpty() // Left join to handle cases where PCO might be null
                                                    where vpa.PcoId == pcoId
                                                          && (pco == null || !pco.IsDeleted) // Ensure PCO is not deleted
                                                          && !vpa.IsDeleted
                                                          && vpa.TenantId == tenantId // Filter TenantId early for better performance
                                                    orderby va.VolunteerActivityName
                                                    select new VolunteerActivityCustom
                                                    {
                                                        PcoId = vpa.PcoId ?? 0, // Using null-coalescing operator for simplicity
                                                        TenantId = vpa.TenantId ?? 0,
                                                        VolunteerActivityId = vpa.VolunteerActivityId ?? 0,
                                                        VolunteerActivityName = va.VolunteerActivityName,
                                                        IsPcoDeleted = pco != null && pco.IsDeleted // Avoids multiple DB queries
                                                    }).ToListAsync().ConfigureAwait(false);

                if (vVolunteer != null) vVolunteer.VolunteerActivityCustoms = lstVolunteerActivities;

                return new GetVolunteersResponse
                {
                    //Data = vVolunteer != null ? new GetVolunteersData { VolunteerPersonCustom = vVolunteer } : new GetVolunteersData { VolunteerPersonCustom = vVolunteer },
                    Data = vVolunteer != null ? new GetVolunteersData { VolunteerPersonCustom = vVolunteer } : null,
                    Message = vVolunteer != null ? "Volunteers person activities retrieved successfully" : "No records found",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetVolunteersResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateVolunteerResponse> UpdateVolunteerAsync(int pcoId, Volunteer t, List<VolunteerPersonActivity> volunteerPersonActivities, int tenantId)
        {
            try
            {
                // Volunteers Update Handling
                t.DateModified = DateTime.Now;
                var vVolunteer = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();

                var lstVolunteerPersonActivities = new List<VolunteerPersonActivity>();
               
                var activityIds = volunteerPersonActivities
                                .Select(a => new { a.PcoId, a.VolunteerActivityId, TenantId = tenantId })
                                .ToList();

                // Fetch all matching records in one query
                var existingActivities = await _dbContext.VolunteerPersonActivities
                                                .Where(vpa => activityIds.Any(a => vpa.PcoId == a.PcoId
                                                                                 && vpa.VolunteerActivityId == a.VolunteerActivityId
                                                                                 && vpa.TenantId == a.TenantId))
                                                .ToListAsync();

                // Process each activity
                foreach (var activity in volunteerPersonActivities)
                {
                    var vPersonActivity = existingActivities.FirstOrDefault(vpa =>
                                                                            vpa.PcoId == activity.PcoId &&
                                                                            vpa.VolunteerActivityId == activity.VolunteerActivityId &&
                                                                            vpa.TenantId == tenantId);

                    if (vPersonActivity != null)
                    {
                        // Update record
                        vPersonActivity.DateModified = DateTime.Now; // Use UtcNow for consistency
                        vPersonActivity.IsDeleted = false;
                        vPersonActivity.VolunteerActivityId = activity.VolunteerActivityId;
                        vPersonActivity.ModifiedBy = _userName;

                        // No need to await inside the loop, defer SaveChanges to the end
                        //await base.UpdateAsync(vPersonActivity);

                        var personActivityEntity = await _volunteerPersonActivityRepository.UpdateAsync(vPersonActivity);
                        lstVolunteerPersonActivities.Add(personActivityEntity);
                    }
                    else
                    {
                        activity.DateEntered = DateTime.Now; // Use UtcNow
                        activity.EnteredBy = _userName;
                        // Add new record
                        var vVolunteerPersonActivity = await _volunteerPersonActivityRepository.AddVolunteerPersonActivityAsync(activity);

                        if (vVolunteerPersonActivity?.Success == true && vVolunteerPersonActivity.Data?.VolunteerPersonActivity != null)
                        {
                            lstVolunteerPersonActivities.Add(vVolunteerPersonActivity.Data.VolunteerPersonActivity);
                        }
                    }
                }

                // Save all changes in one go (reduces database round trips)
                //await _dbContext.SaveChangesAsync();







                //var lstPersonActivities = await _dbContext.VolunteerPersonActivities
                //                                .Where(vpa => vpa.PcoId.Equals(pcoId) && vpa.IsDeleted.Equals(false) && vpa.TenantId.Equals(tenantId))
                //                                .ToListAsync().ConfigureAwait(false);

                //foreach (var personActivity in lstPersonActivities)
                //{
                //    foreach(var volunteerPersonActivity in lstVolunteerPersonActivities)
                //    {
                //        if (!personActivity.Id.Equals(volunteerPersonActivity.Id))
                //        {
                //            // If not matched then we need to delete those activities
                //            // When exist then let it back not deleted
                //            personActivity.IsDeleted = true;
                //            personActivity.DateModified = DateTime.Now;
                //            personActivity.ModifiedBy = _userName;
                //            var volunteerPersonActivityResponse = await _volunteerPersonActivityRepository.UpdateVolunteerPersonActivityAsync(personActivity);
                //        }
                //    }
                //}


                //////
                // Fetch all active VolunteerPersonActivities in one go
                var lstPersonActivities = await _dbContext.VolunteerPersonActivities
                                                .Where(vpa => vpa.PcoId == pcoId && !vpa.IsDeleted && vpa.TenantId == tenantId)
                                                .ToListAsync().ConfigureAwait(false);

                // Get the set of volunteerPersonActivity IDs for faster lookup
                var validVolunteerActivityIds = new HashSet<int>(lstVolunteerPersonActivities.Select(vpa => vpa.Id));

                // Identify activities to delete
                var activitiesToDelete = lstPersonActivities
                                            .Where(personActivity => !validVolunteerActivityIds.Contains(personActivity.Id))
                                            .ToList();

                // Mark them as deleted
                foreach (var personActivity in activitiesToDelete)
                {
                    personActivity.IsDeleted = true;
                    personActivity.DateModified = DateTime.Now;
                    personActivity.ModifiedBy = _userName;
                }

                // Perform batch update
                if (activitiesToDelete.Any())
                {
                    await _volunteerPersonActivityRepository.UpdateVolunteerPersonActivitiesAsync(activitiesToDelete);
                    await _dbContext.SaveChangesAsync().ConfigureAwait(false);
                }



                //////

                return new UpdateVolunteerResponse()
                {
                    Success = true,
                    Data = new UpdateVolunteerData { VolunteerId = vVolunteer.Id, Volunteer = t, VolunteerPersonActivities = lstVolunteerPersonActivities },
                    Message = "Volunteer person activities updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateVolunteerResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
