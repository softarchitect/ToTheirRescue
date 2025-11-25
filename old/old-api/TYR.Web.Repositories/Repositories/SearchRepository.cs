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
using TYR.WEB.Models.Response.SearchResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class SearchRepository : RepositoryBase<AnimalMilestone>, ISearchRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly IAnimalMilestoneRepository _animalMilestoneRepository;
        private readonly IAnimalRepository _animalRepository;
        private readonly IPCORepository _pcoRepository;
        public SearchRepository(TYRDbContext dbContext, IAnimalMilestoneRepository animalMilestoneRepository, IAnimalRepository animalRepository, IPCORepository pcoRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _animalMilestoneRepository = animalMilestoneRepository;
            _animalRepository = animalRepository;
            _pcoRepository = pcoRepository;
        }

        public async Task<GetAnimalMilestoneSearchResponse> GetAnimalMilestoneSearchAsync(string milestoneType, int acquisitionWayId, int animalTypeId, string otherRescueIdNo, int pcoId, string note, int tenantId)
        {
            #region SQL Statement
            //SELECT AnimalMilestones.ID As ID, 
            //    Animals.ID, 
            //    AnimalMilestones.PcoId, 
            //    AnimalMilestones.MilestoneDate, 
            //    Animals.AnimalName, 
            //    Animals.AnimalTypeName, 
            //    AnimalMilestones.MilestoneType, 
            // AnimalMilestones.Notes,
            //    --AnimalMilestones.HowAcquired, 
            //    PCOs.LastName As OtherRescue, AnimalMilestones.OtherRescueShelterId, 
            //    --AnimalMilestones.OtherRescueIDNo, 
            //    AnimalMilestones.AcquisitionWayName, AcquisitionWay.Id, 
            //    PCOs.LastName, 
            //    PCOs.FirstName,
            //    AnimalMilestones.IsDeleted As MilestoneDeleted,
            // Animals.IsDeleted As AnimalsDeleted,
            // PCOs.IsDeleted As PCOsDeleted,
            // PCOs.Rescue,
            // AnimalMilestones.Notes
            //FROM Animals
            //INNER JOIN AnimalMilestones ON Animals.ID = AnimalMilestones.AnimalID
            //INNER JOIN PCOs ON AnimalMilestones.PcoID = PCOs.ID
            //INNER JOIN AcquisitionWay ON AnimalMilestones.AcquisitionWayId = AcquisitionWay.Id


            //-- INNER JOIN(PCOs INNER JOIN AnimalMilestones ON AnimalMilestones.PcoID = PCOs.ID) ON Animals.ID = AnimalMilestones.AnimalID
            //WHERE AnimalMilestones.MilestoneType = 'Intake'
            //  --AND AcquisitionWay.Id = 7
            //  --AND Animals.AnimalTypeName = 'Cats'
            //  AND AnimalMilestones.TenantID = 2
            //  AND AnimalMilestones.IsDeleted = 0
            //  AND Animals.IsDeleted = 0
            //  AND AnimalMilestones.Notes like '%t%'
            // -- AND PCOs.Id = 423
            //  --AND PCOs.
            //  ORDER BY AnimalMilestones.MilestoneDate
            #endregion
            try
            {
                var lstAnimalMilestoneSearch = new List<AnimalMilestoneSearch>();
                DateTime? dtDate = null;

                var milestoneSearchQueryable = from a in _dbContext.Animals
                                                  join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                                  join p in _dbContext.PCOs on am.PcoId equals p.Id
                                                  join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                                  join aw in _dbContext.AcquisitionWays on am.AcquisitionWayId equals aw.Id
                                                  select new AnimalMilestoneSearch
                                                  {
                                                      Id = am.Id,
                                                      AnimalId = a.Id,
                                                      PcoId = p.Id,
                                                      AcquisitionWayId = aw.Id,
                                                      AnimalTypeId = at.Id,
                                                      TenantId = am.TenantId.Value,
                                                      MilestoneDate = am.MilestoneDate ?? dtDate,
                                                      AnimalName = a.AnimalName,
                                                      AnimalTypeName = at.TypeName,
                                                      MilestoneType = am.MilestoneType,
                                                      OtherRescue = am.OtherRescueShelterId.HasValue ?
                                                         _dbContext.PCOs.Where(pco => pco.Rescue.Equals(true)
                                                                            && pco.EntityType.Equals(EntityType.Company_Organisation)
                                                                            && pco.IsDeleted.Equals(false)
                                                                            && pco.TenantId.Equals(tenantId)
                                                                            && pco.Id.Equals(am.OtherRescueShelterId.Value)).FirstOrDefault().LastName
                                                         : string.Empty,
                                                      HowAcquired = am.AcquisitionWayName,
                                                      OtherRescueIdNo = am.OtherRescueIDNo,
                                                      Notes = am.Notes,
                                                      AnimalMilestoneDeleted = am.IsDeleted,
                                                      AnimalDeleted = a.IsDeleted,
                                                      PcoDeleted = p.IsDeleted,
                                                      AcquisitionWayDeleted = aw.IsDeleted
                                                  };

                if (!string.IsNullOrEmpty(milestoneType)) milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.MilestoneType.ToLower().Equals(milestoneType.ToLower()));
                if (acquisitionWayId > 0) milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.AcquisitionWayId.Equals(acquisitionWayId));
                if (animalTypeId > 0) milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.AnimalTypeId.Equals(animalTypeId));
                if (!string.IsNullOrEmpty(otherRescueIdNo)) milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.OtherRescueIdNo.Equals(otherRescueIdNo));
                if (pcoId > 0) milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.PcoId.Equals(pcoId));
                if (!string.IsNullOrEmpty(note)) milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.Notes.Contains(note));

                milestoneSearchQueryable = milestoneSearchQueryable.Where(ams => ams.TenantId.Equals(tenantId)
                                                                               && ams.AnimalMilestoneDeleted.Equals(false)
                                                                               && ams.AnimalDeleted.Equals(false));
                lstAnimalMilestoneSearch = await milestoneSearchQueryable.OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                #region MyRegion
                /*
                        /************************
                         When MilestoneTypeId > 0
                              AcquisitionWayId > 0
                              AnimalTypeId > 0
                              OtherRescueIDNo has value
                              PcoId > 0
                              Note has value
                         *********************/
                /*if (milestoneTypeId > 0 && acquisitionWayId > 0 && animalTypeId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && pcoId > 0 && !string.IsNullOrEmpty(note))
                {
                    lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                   .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                       && ams.AnimalTypeId.Equals(animalTypeId)
                                                       && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                       && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                       && ams.PcoId.Equals(pcoId)
                                                       && ams.Notes.Contains(note)
                                                       && ams.TenantId.Equals(tenantId)
                                                       && ams.AnimalMilestoneDeleted.Equals(false)
                                                       && ams.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }*/
                /************************
                 When MilestoneTypeId > 0
                      AcquisitionWayId > 0
                      AnimalTypeId > 0
                      OtherRescueIDNo has value
                      PcoId > 0
                 *********************/
                /*else if (milestoneTypeId > 0 && acquisitionWayId > 0 && animalTypeId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && pcoId > 0)
                {
                    lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                   .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                       && ams.AnimalTypeId.Equals(animalTypeId)
                                                       && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                       && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                       && ams.PcoId.Equals(pcoId)
                                                       && ams.TenantId.Equals(tenantId)
                                                       && ams.AnimalMilestoneDeleted.Equals(false)
                                                       && ams.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }*/
                /************************
                 When MilestoneTypeId > 0
                      AcquisitionWayId > 0
                      AnimalTypeId > 0
                      OtherRescueIDNo has value
                      Note has value
                 *********************/
                /* else if (milestoneTypeId > 0 && acquisitionWayId > 0 && animalTypeId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && !string.IsNullOrEmpty(note))
                 {
                     lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                    .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                        && ams.AnimalTypeId.Equals(animalTypeId)
                                                        && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                        && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                        && ams.Notes.Contains(note)
                                                        && ams.TenantId.Equals(tenantId)
                                                        && ams.AnimalMilestoneDeleted.Equals(false)
                                                        && ams.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                 }*/
                /************************
                 When MilestoneTypeId > 0
                      AcquisitionWayId > 0
                      AnimalTypeId > 0
                      PcoId > 0
                      Note has value
                 *********************/
                /*else if (milestoneTypeId > 0 && acquisitionWayId > 0 && animalTypeId > 0 && pcoId > 0 && !string.IsNullOrEmpty(note))
                {
                    lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                   .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                       && ams.AnimalTypeId.Equals(animalTypeId)
                                                       && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                       && ams.PcoId.Equals(pcoId)
                                                       && ams.Notes.Contains(note)
                                                       && ams.TenantId.Equals(tenantId)
                                                       && ams.AnimalMilestoneDeleted.Equals(false)
                                                       && ams.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                }*/
                /************************
                 When MilestoneTypeId > 0
                      AcquisitionWayId > 0
                      OtherRescueIDNo has value
                      PcoId > 0
                      Note has value
                 *********************/
                /* else if (milestoneTypeId > 0 && acquisitionWayId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && pcoId > 0 && !string.IsNullOrEmpty(note))
                 {
                     lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                    .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                        && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                        && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                        && ams.PcoId.Equals(pcoId)
                                                        && ams.Notes.Contains(note)
                                                        && ams.TenantId.Equals(tenantId)
                                                        && ams.AnimalMilestoneDeleted.Equals(false)
                                                        && ams.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                 }*/
                /************************
                 When MilestoneTypeId > 0
                      AnimalTypeId > 0
                      OtherRescueIDNo has value
                      PcoId > 0
                      Note has value
                 *********************/
                /*else if (milestoneTypeId > 0 && animalTypeId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && pcoId > 0 && !string.IsNullOrEmpty(note))
                {
                    lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                   .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                       && ams.AnimalTypeId.Equals(animalTypeId)
                                                       && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                       && ams.PcoId.Equals(pcoId)
                                                       && ams.Notes.Contains(note)
                                                       && ams.TenantId.Equals(tenantId)
                                                       && ams.AnimalMilestoneDeleted.Equals(false)
                                                       && ams.AnimalDeleted.Equals(false))
                                                   .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                } */
                /************************
                 When 
                      AcquisitionWayId > 0
                      AnimalTypeId > 0
                      OtherRescueIDNo has value
                      PcoId > 0
                      Note has value
                 *********************/
                /* else if (acquisitionWayId > 0 && animalTypeId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && pcoId > 0 && !string.IsNullOrEmpty(note))
                 {
                     lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                    .Where(ams => ams.AnimalTypeId.Equals(animalTypeId)
                                                        && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                        && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                        && ams.PcoId.Equals(pcoId)
                                                        && ams.Notes.Contains(note)
                                                        && ams.TenantId.Equals(tenantId)
                                                        && ams.AnimalMilestoneDeleted.Equals(false)
                                                        && ams.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                 }*/
                /************************
                 When MilestoneTypeId > 0
                      AcquisitionWayId > 0
                      AnimalTypeId > 0
                      OtherRescueIDNo has value
                      PcoId > 0
                      Note has value
                 *********************/
                /* else if (milestoneTypeId > 0 && acquisitionWayId > 0 && animalTypeId > 0 && !string.IsNullOrEmpty(otherRescueIdNo) && pcoId > 0 && !string.IsNullOrEmpty(note))
                 {
                     lstAnimalMilestoneSearch = await milestoneSearchQueryable
                                                    .Where(ams => ams.Id.Equals(milestoneTypeId)
                                                        && ams.AnimalTypeId.Equals(animalTypeId)
                                                        && ams.AcquisitionWayId.Equals(acquisitionWayId)
                                                        && ams.OtherRescueIdNo.Equals(otherRescueIdNo)
                                                        && ams.PcoId.Equals(pcoId)
                                                        && ams.Notes.Contains(note)
                                                        && ams.TenantId.Equals(tenantId)
                                                        && ams.AnimalMilestoneDeleted.Equals(false)
                                                        && ams.AnimalDeleted.Equals(false))
                                                    .OrderByDescending(amq => amq.MilestoneDate).ToListAsync().ConfigureAwait(false);
                 }

                 */ 
                #endregion


                return new GetAnimalMilestoneSearchResponse
                {
                    Data = new GetAnimalMilestoneSearchData { Count = lstAnimalMilestoneSearch.Count(), AnimalMilestoneSearches = lstAnimalMilestoneSearch },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animal Milestone search data retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalMilestoneSearchResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "Oops! Something went wrong while getting the animal milestone search records", ex.InnerException.ToString() }
                };
            }
            
        }
    }
}
