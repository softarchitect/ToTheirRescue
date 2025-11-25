using EllipticCurve.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.QueryResult;

namespace TYR.Web.Repositories.Repositories
{
    public class QueryRepository : RepositoryBase<AnimalMilestone>, IQueryRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly IAnimalMilestoneRepository _animalMilestoneRepository;
        private readonly IAnimalRepository _animalRepository;
        private readonly IPCORepository _pcoRepository;
        public QueryRepository(TYRDbContext dbContext, IAnimalMilestoneRepository animalMilestoneRepository, IAnimalRepository animalRepository, IPCORepository pcoRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _animalMilestoneRepository = animalMilestoneRepository;
            _animalRepository = animalRepository;
            _pcoRepository = pcoRepository;
        }
        public async Task<GetAnimalMilestoneQueryResponse> GetAnimalMilestoneQueryAsync(string milestoneType, string animalTypeName, DateTime? milestoneStartDate, DateTime? milestoneEndDate, int tenantId)
        {
            try
            {
                var lstAnimalMilestoneQuery = new List<AnimalMilestoneQuery>();
                #region SQL Statement used for getting Animal Milestone
                //SELECT AnimalMilestones.ID As ID, 
                //    Animals.ID, 
                //    AnimalMilestones.PcoId, 
                //    AnimalMilestones.MilestoneDate, 
                //    Animals.AnimalName, 
                //    Animals.AnimalTypeName, 
                //    AnimalMilestones.MilestoneType, 
                //    --AnimalMilestones.HowAcquired, 
                //    PCOs.LastName As OtherRescue, AnimalMilestones.OtherRescueShelterId, 
                //    --AnimalMilestones.OtherRescueIDNo, 
                //    AnimalMilestones.AcquisitionWayName, 
                //    PCOs.LastName, 
                //    PCOs.FirstName,
                //    AnimalMilestones.IsDeleted As MilestoneDeleted,
                //Animals.IsDeleted As AnimalsDeleted,
                //PCOs.IsDeleted As PCOsDeleted
                //FROM Animals
                //INNER JOIN AnimalMilestones ON Animals.ID = AnimalMilestones.AnimalID
                //INNER JOIN PCOs ON AnimalMilestones.PcoID = PCOs.ID

                //-- INNER JOIN(PCOs INNER JOIN AnimalMilestones ON AnimalMilestones.PcoID = PCOs.ID) ON Animals.ID = AnimalMilestones.AnimalID
                //WHERE AnimalMilestones.MilestoneType = 'Intake'
                //  AND Animals.AnimalTypeName = 'Cats'
                //  AND AnimalMilestones.MilestoneDate >= '2020-04-23'
                //  AND AnimalMilestones.MilestoneDate <= '2024-11-23'
                //  AND AnimalMilestones.TenantID = 2
                //  AND AnimalMilestones.IsDeleted = 0
                //  AND Animals.IsDeleted = 0
                //  --AND PCOs.
                //  ORDER BY AnimalMilestones.MilestoneDate 
                #endregion

                DateTime? dtDate = null;
                // When MilestoneType selected
                if (!string.IsNullOrEmpty(milestoneType) && !string.IsNullOrEmpty(animalTypeName) && milestoneStartDate.HasValue && milestoneEndDate.HasValue)
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                   .Where(amq => amq.MilestoneType.ToLower().Equals(milestoneType.ToLower()) && amq.AnimalTypeName.ToLower().Equals(animalTypeName.ToLower())
                                                        && amq.MilestoneDate >= milestoneStartDate && amq.MilestoneDate <= milestoneEndDate && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else if (!string.IsNullOrEmpty(milestoneType) && !string.IsNullOrEmpty(animalTypeName))
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                   .Where(amq => amq.MilestoneType.ToLower().Equals(milestoneType.ToLower()) && amq.AnimalTypeName.ToLower().Equals(animalTypeName.ToLower()) && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else if (!string.IsNullOrEmpty(milestoneType) && milestoneStartDate.HasValue && milestoneEndDate.HasValue)
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                   .Where(amq => amq.MilestoneType.ToLower().Equals(milestoneType.ToLower()) && amq.MilestoneDate >= milestoneStartDate && amq.MilestoneDate <= milestoneEndDate && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else if (!string.IsNullOrEmpty(animalTypeName) && milestoneStartDate.HasValue && milestoneEndDate.HasValue)
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                   .Where(amq => amq.AnimalTypeName.ToLower().Equals(animalTypeName.ToLower()) && amq.MilestoneDate >= milestoneStartDate && amq.MilestoneDate <= milestoneEndDate && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else if (milestoneStartDate.HasValue && milestoneEndDate.HasValue)
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                    .Where(amq => amq.MilestoneDate >= milestoneStartDate && amq.MilestoneDate <= milestoneEndDate && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else if (!string.IsNullOrEmpty(milestoneType))
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                    .Where(amq => amq.MilestoneType.ToLower().Equals(milestoneType.ToLower()) && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else if(!string.IsNullOrEmpty(animalTypeName))
                {
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                    .Where(amq => amq.AnimalTypeName.ToLower().Equals(animalTypeName.ToLower()) && amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    // select * from PCOs where rescue=1 and isDeleted=0 and TenantId=2 and EntityType='CorO'
                    lstAnimalMilestoneQuery = await (from a in _dbContext.Animals
                                                     join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                     join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                     select new AnimalMilestoneQuery
                                                     {
                                                         Id = am.Id,
                                                         AnimalId = a.Id,
                                                         PcoId = p.Id,
                                                         TenantId = am.TenantId.Value,
                                                         MilestoneDate = am.MilestoneDate ?? dtDate,
                                                         AnimalName = a.AnimalName,
                                                         AnimalTypeName = a.AnimalTypeName,
                                                         MilestoneType = am.MilestoneType,
                                                         OtherRescue = am.OtherRescueShelterId.HasValue ? 
                                                            _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true) && pco.EntityType.Equals(EntityType.Company_Organisation) && pco.IsDeleted.Equals(false) && pco.TenantId.Equals(tenantId) && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName 
                                                            : string.Empty,
                                                         HowAcquired = am.AcquisitionWayName,
                                                         LastName = p.LastName,
                                                         FirstName = p.FirstName,
                                                         Notes = am.Notes,
                                                         AnimalMilestoneDeleted = am.IsDeleted,
                                                         AnimalDeleted = a.IsDeleted,
                                                         PcoDeleted = p.IsDeleted
                                                     })
                                                     .Where(amq => amq.TenantId.Equals(tenantId) && amq.AnimalMilestoneDeleted.Equals(false) && amq.AnimalDeleted.Equals(false))
                                                     .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }

                return new GetAnimalMilestoneQueryResponse
                {
                    Data = new GetAnimalMilestoneQueryData { Count = lstAnimalMilestoneQuery.Count(), AnimalMilestoneQueries = lstAnimalMilestoneQuery },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animal Milestone query data retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalMilestoneQueryResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "Oops! Something went wrong while getting the animal milestone query records", ex.InnerException.ToString() }
                };
            }
        }
    }
}
