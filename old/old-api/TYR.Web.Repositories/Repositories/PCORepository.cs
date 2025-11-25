using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.PCOResult;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.ViewModels.PCO;
using TYR.WEB.Models.Paging;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using EllipticCurve.Utils;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Runtime.Intrinsics.X86;
using Microsoft.AspNetCore.Identity;
using TYR.WEB.DataAccess.IdentityAuth;
using Microsoft.AspNetCore.Http;

namespace TYR.Web.Repositories.Repositories
{
#pragma warning disable S101 // Types should be named in PascalCase
    public class PCORepository : RepositoryBase<PCO>, IPCORepository
#pragma warning restore S101 // Types should be named in PascalCase
    {
        private readonly TYRDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICountryRepository _countryRepository;
        private readonly IArtifactAttachmentRepository _artifactAttachmentRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;

        public PCORepository(
            TYRDbContext dbContext,
            IMapper mapper,
            ICountryRepository countryRepository,
            IArtifactAttachmentRepository artifactAttachmentRepository,
            UserManager<ApplicationUser> userManager,
            IHttpContextAccessor httpContextAccessor
        ) : base(dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _countryRepository = countryRepository ?? throw new ArgumentNullException(nameof(countryRepository));
            _artifactAttachmentRepository = artifactAttachmentRepository ?? throw new ArgumentNullException(nameof(artifactAttachmentRepository));
            _userManager = userManager;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        public async Task<AddPCOResponse> AddNewPCO(PCO pco, int tenantId)
        {
            try
            {
                var _newPco = await AddAsync(pco);

                var pcoCustom = new PCOCustom
                {
                    TenantId = _newPco.TenantId,
                    City = _newPco.City,
                    Contact = _newPco.Contact,
                    CountryId = _newPco.CountryId,
                    DateEntered = _newPco.DateEntered,
                    DateModified = _newPco.DateModified,
                    Email = _newPco.Email,
                    EnteredBy = _newPco.EnteredBy,
                    EntityType = _newPco.EntityType,
                    FirstName = _newPco.FirstName,
                    LastName = _newPco.LastName,
                    Flag = _newPco.Flag,
                    FlagReason = _newPco.FlagReason,
                    Hospital = _newPco.Hospital,
                    Id = _newPco.Id,
                    IsDeleted = _newPco.IsDeleted,
                    MailList = _newPco.MailList,
                    ModifiedBy = _newPco.ModifiedBy,
                    Notes = _newPco.Notes,
                    OtherPhone = _newPco.OtherPhone,
                    Phone = _newPco.Phone,
                    Rescue = _newPco.Rescue,
                    RescueContact = _newPco.RescueContact,
                    State = _newPco.State,
                    Street = _newPco.Street,
                    Street2 = _newPco.Street2,
                    SystemRecord = _newPco.SystemRecord,
                    Website = _newPco.Website,
                    Zip = _newPco.Zip
                };

                return new AddPCOResponse
                {
                    Data = new AddPCOData
                    {
                        Id = _newPco.Id,
                        PCO = pcoCustom
                    },
                    Message = "PCO added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddPCOResponse
                {
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while adding PCO",
                                    ex.InnerException?.ToString() ?? ex.Message // Prevents NullReferenceException
                                },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetPcoListPageResponse> GetPCOListAsync(int tenantId, bool isDeleted, string searchText, string entityType, int limit, int page)
        {
            //try
            //{
                //    // Define base query
                //    IQueryable<PCO> query = _dbContext.PCOs
                //        .Where(p => p.IsDeleted == isDeleted && p.TenantId == tenantId);

                //    // Apply filtering
                //    if (!string.IsNullOrEmpty(entityType))
                //    {
                //        var _entityType = entityType.Equals(EntityType.Person, StringComparison.OrdinalIgnoreCase)
                //            ? EntityType.Person
                //            : EntityType.Company_Organisation;

                //        query = query.Where(p => p.EntityType == _entityType);
                //    }

                //    if (!string.IsNullOrEmpty(searchText))
                //    {
                //        query = query.Where(p => p.LastName.Contains(searchText));
                //    }

                //    // Order by LastName before pagination
                //    query = query.OrderBy(p => p.LastName);

                //    // Get paginated results
                //    var _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(query, page, limit);

                //    // Map paginated list to ViewModel
                //    var _pCOListVms = _mapper.Map<List<PCOListVm>>(_pcopaginatedlist);

                //    // Fetch additional data asynchronously
                //    var countryTasks = _pCOListVms.Select(async p =>
                //    {
                //        var country = await _countryRepository.GetByIdAsync(p.CountryId);
                //        //var attachments = await _artifactAttachmentRepository.GetAllAttachmentByPCOIdAsync(p.Id, tenantId);
                //        //var attachments = await _dbContext(p.Id, tenantId);
                //        var lstAttachment = await _dbContext.ArtifactAttachments
                //                                 .Where(a => a.PcoId == p.Id && a.Entity == "PCO" && a.TenantId == tenantId && !a.IsDeleted)
                //                                 .OrderBy(a => a.PublicityRank)
                //                                 .ToListAsync(); // Simplified Boolean check

                //        // Order by Publicity Rank and return as a list
                //        //var lstAttachmentOrdered = lstAttachment.OrderBy(a => a.PublicityRank).ToList();
                //        // //Attachments = _artifactAttachmentRepository.FindAllAsync(p => p.PcoId.Equals(p.Id) && p.Entity.Equals("PCO") && p.TenantId.Equals(tenantId) && p.IsDeleted.Equals(false)).Result.OrderBy(p => p.PublicityRank).ToList<ArtifactAttachment>()

                //        return new PCOListVm
                //        {
                //            Id = p.Id,
                //            FirstName = p.FirstName,
                //            LastName = p.LastName,
                //            Street = p.Street,
                //            Street2 = p.Street2,
                //            City = p.City,
                //            State = p.State,
                //            Zip = p.Zip,
                //            Phone = p.Phone,
                //            OtherPhone = p.OtherPhone,
                //            Email = p.Email,
                //            MailList = p.MailList,
                //            Notes = p.Notes,
                //            EntityType = p.EntityType,
                //            Hospital = p.Hospital,
                //            Rescue = p.Rescue,
                //            Flag = p.Flag,
                //            FlagReason = p.FlagReason,
                //            Website = p.Website,
                //            CountryId = p.CountryId,
                //            CountryName = country?.CountryName,
                //            CountryISO2Code = country?.ISO2Code,
                //            CountryISDCode = (int)(country?.ISDCode),
                //            Attachments = lstAttachment //attachments.Data.ArtifactAttachments
                //        };
                //    });

                //    var _pcoList = await Task.WhenAll(countryTasks);

                //    return new GetPcoListPageResponse
                //    {
                //        Data = new PCOPageData
                //        {
                //            CurrentPage = _pcopaginatedlist.CurrentPage,
                //            PCOList = _pcoList.ToList(),
                //            TotalItems = _pcopaginatedlist.TotalCount,
                //            TotalPage = _pcopaginatedlist.TotalPages,
                //            NextPage = _pcopaginatedlist.NextPage,
                //            PrevPage = _pcopaginatedlist.PreviousPage
                //        },
                //        Message = "PCO retrieved successfully",
                //        StatusCode = 200,
                //        Success = true
                //    };
                //}
                //catch (Exception ex)
                //{
                //    return new GetPcoListPageResponse
                //    {
                //        Data = new PCOPageData
                //        {
                //            CurrentPage = 0,
                //            PCOList = null,
                //            TotalItems = 0,
                //            TotalPage = 0
                //        },
                //        Errors = new List<string> { "Oops! Something went wrong while getting the records", ex.Message },
                //        StatusCode = 400,
                //        Success = false
                //    };
                //}




            PaginatedList<PCO> _pcopaginatedlist = new();
            var _entityType = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(searchText) && string.IsNullOrEmpty(entityType))
                {
                    _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId)).OrderBy(p => p.LastName), page, limit);
                }
                else
                {
                    if (string.IsNullOrEmpty(entityType) && !string.IsNullOrEmpty(searchText))
                    {
                        _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.LastName.Contains(searchText)).OrderBy(p => p.LastName), page, limit);
                    }
                    else if (!string.IsNullOrEmpty(entityType) && string.IsNullOrEmpty(searchText))
                    {
                        _entityType = entityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
                        _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.EntityType.Equals(_entityType)).OrderBy(p => p.LastName), page, limit);

                    }
                    else
                    {
                        _entityType = entityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
                        _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.EntityType.Equals(_entityType) && p.LastName.Contains(searchText)).OrderBy(p => p.LastName), page, limit);

                    }
                }
                List<PCOListVm> _pCOListVms = new();
                _pCOListVms = _mapper.Map<List<PCOListVm>>(_pcopaginatedlist);

                var _pcoList = _pCOListVms.Select(p => new PCOListVm
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Street = p.Street,
                    Street2 = p.Street2,
                    City = p.City,
                    State = p.State,
                    Zip = p.Zip,
                    Phone = p.Phone,
                    OtherPhone = p.OtherPhone,
                    Email = p.Email,
                    MailList = p.MailList,
                    Notes = p.Notes,
                    EntityType = p.EntityType,
                    Hospital = p.Hospital,
                    Rescue = p.Rescue,
                    Flag = p.Flag,
                    FlagReason = p.FlagReason,
                    Website = p.Website,
                    CountryId = p.CountryId,
                    CountryName = _countryRepository.GetByIdAsync(p.CountryId).Result.CountryName,
                    CountryISO2Code = _countryRepository.GetByIdAsync(p.CountryId).Result.ISO2Code,
                    CountryISDCode = _countryRepository.GetByIdAsync(p.CountryId).Result.ISDCode,
                    Attachments = _artifactAttachmentRepository.GetAllAttachmentByPCOIdAsync(p.Id, tenantId).Result.Data.ArtifactAttachments
                    //Attachments = _artifactAttachmentRepository.FindAllAsync(p => p.PcoId.Equals(p.Id) && p.Entity.Equals("PCO") && p.TenantId.Equals(tenantId) && p.IsDeleted.Equals(false)).Result.OrderBy(p => p.PublicityRank).ToList<ArtifactAttachment>()
                }).ToList<PCOListVm>();


                return new GetPcoListPageResponse
                {
                    Data = new PCOPageData
                    {
                        CurrentPage = _pcopaginatedlist.CurrentPage,
                        PCOList = _pcoList,
                        TotalItems = _pcopaginatedlist.TotalCount,
                        TotalPage = _pcopaginatedlist.TotalPages,
                        NextPage = _pcopaginatedlist.NextPage,
                        PrevPage = _pcopaginatedlist.PreviousPage
                    },
                    Message = "PCO retrieved successfully",
                    StatusCode = 200,
                    Success = true

                };

            }
            catch (Exception ex)
            {
                return new GetPcoListPageResponse
                {
                    Data = new PCOPageData
                    {
                        CurrentPage = 0,
                        PCOList = null,
                        TotalItems = 0,
                        TotalPage = 0

                    },
                    Errors = new List<string> { "Oops! Something went wrong while geting the records", ex.Message },
                    StatusCode = 400,
                    Success = false
                };

            }
        }

        public async Task<GetPCOAvailableResponse> AvailablePCO(bool isDeleted, PCO pco, int tenantId)
        {
            try
            {
                bool isPerson = pco.EntityType == EntityType.Person;

                var type = await FindAllAsync(a =>
                                                a.IsDeleted == isDeleted &&
                                                a.TenantId == tenantId &&
                                                a.EntityType == (isPerson ? EntityType.Person : EntityType.Company_Organisation) &&
                                                a.LastName == pco.LastName &&
                                                (!isPerson || a.FirstName == pco.FirstName) // Only check FirstName if it's a Person
                                            );

                return new GetPCOAvailableResponse
                {
                    Data = new GetAvailablePCOData
                    {
                        IsAvailable = !type.Any() // More efficient than Count < 1
                    },
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new GetPCOAvailableResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting PCO data" },
                    Success = false,
                    StatusCode = 400
                };
            }


        }
        public async Task<UpdatePCOResponse> UpdatePCOByIdAsync(PCO pco, int pcoid, string _userName)
        {
            try
            {
                var _pco = await FindAsync(p => p.Id == pcoid);
                if (_pco == null)
                {
                    return new UpdatePCOResponse
                    {
                        Errors = new List<string> { "PCO not found." },
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Update fields conditionally
                if (_pco.EntityType == EntityType.Person && !string.IsNullOrEmpty(pco.FirstName))
                    _pco.FirstName = pco.FirstName;

                _pco.LastName = pco.LastName ?? _pco.LastName;
                _pco.Street = pco.Street ?? _pco.Street;
                _pco.Street2 = pco.Street2 ?? _pco.Street2;
                _pco.City = pco.City ?? _pco.City;
                _pco.State = pco.State ?? _pco.State;
                _pco.Zip = pco.Zip ?? _pco.Zip;
                _pco.CountryId = pco.CountryId > 0 ? pco.CountryId : _pco.CountryId;
                _pco.Phone = pco.Phone ?? _pco.Phone;
                _pco.OtherPhone = pco.OtherPhone ?? _pco.OtherPhone;
                _pco.Email = pco.Email ?? _pco.Email;
                _pco.MailList = pco.MailList;
                _pco.Website = pco.Website ?? _pco.Website;
                _pco.Notes = pco.Notes ?? _pco.Notes;
                _pco.EntityType = pco.EntityType ?? _pco.EntityType;
                _pco.Hospital = pco.Hospital;
                _pco.Rescue = pco.Rescue;
                _pco.Flag = pco.Flag;
                _pco.FlagReason = pco.FlagReason ?? _pco.FlagReason;
                _pco.DateModified = DateTime.UtcNow;
                _pco.ModifiedBy = _userName;

                await UpdateAsync(_pco);
                await _context.SaveChangesAsync(); // Ensure async database save

                return new UpdatePCOResponse
                {
                    Data = new UpdatePcoData { Id = _pco.Id, PCO = _pco },
                    Success = true,
                    Message = "PCO updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdatePCOResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.Message },
                    Success = false,
                    StatusCode = 200 // Updated to 500 for server error
                };
            }


            //try
            //{
            //    var _pco = await FindAsync(p => p.Id.Equals(pcoid));
            //    if(_pco.EntityType.Equals(EntityType.Person))
            //    {
            //        _pco.FirstName = !string.IsNullOrEmpty(pco.FirstName) ? pco.FirstName : _pco.FirstName;
            //    }
            //    if (pco.LastName !=null) _pco.LastName= pco.LastName;
            //    if (pco.Street != null)  _pco.Street = pco.Street;
            //    if (pco.Street2 != null) _pco.Street2 = pco.Street2;
            //    if (pco.City != null)  _pco.City = pco.City;
            //    if (pco.State != null) _pco.State= pco.State;
            //    if (pco.Zip != null) _pco.Zip = pco.Zip;
            //    if (pco.CountryId > 0) _pco.CountryId = pco.CountryId;
            //    if (pco.Phone != null) _pco.Phone = pco.Phone;
            //    if (pco.OtherPhone != null) _pco.OtherPhone = pco.OtherPhone;
            //    if (pco.Email != null) _pco.Email = pco.Email;
            //    _pco.MailList = pco.MailList;
            //    if (pco.Website != null) _pco.Website = pco.Website;
            //    //if (pco.Contact != null) _pco.Contact = pco.Contact;
            //    //if (pco.RescueContact != null) _pco.RescueContact = pco.RescueContact;

            //    if (pco.Notes != null) _pco.Notes = pco.Notes;
            //    if (pco.EntityType != null) _pco.EntityType = pco.EntityType;
            //    _pco.Hospital = pco.Hospital;
            //    _pco.Rescue = pco.Rescue;
            //    _pco.Flag = pco.Flag;
            //    if (pco.FlagReason != null) _pco.FlagReason = pco.FlagReason;
            //    _pco.DateModified = DateTime.Now;
            //    _pco.ModifiedBy = _userName;
            //    await UpdateAsync(_pco);
            //    _context.SaveChanges();
            //    return new UpdatePCOResponse
            //    {
            //        Data = new UpdatePcoData { Id = _pco.Id, PCO = _pco },
            //        Success = true,
            //        Message = "PCO updated successfully",
            //        StatusCode = 200
            //    };
            //}
            //catch(Exception ex)
            //{
            //    return new UpdatePCOResponse
            //    {
            //        Errors = new List<string> { "Oops! Something went wrong while updating record", ex.Message },
            //        Success= false,
            //        StatusCode=200

            //    };
            //}
        }
        public async  Task<DeletePCOResponse> DeletePcoByIdAsync(int pcoId)
        {
            //need to implemet the deletion of PCO for Intake milestone 

            try
            {
                var _pco = await FindAsync(p => p.Id == pcoId);

                if (_pco == null)
                {
                    return new DeletePCOResponse
                    {
                        Errors = new List<string> { "PCO not found!" },
                        StatusCode = 404, // Changed to 404 for not found
                        Success = false
                    };
                }

                _pco.IsDeleted = true;
                await UpdateAsync(_pco);
                await _context.SaveChangesAsync(); // Ensure async database save

                return new DeletePCOResponse
                {
                    Data = new GetDeletePCOData { IsDeleted = true },
                    Success = true,
                    Message = "PCO deleted successfully!",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeletePCOResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.Message },
                    StatusCode = 200, // Changed to 500 for internal server error
                    Success = false
                };
            }
        }
        public async Task<PcoSearchAutoCompleteListResponse> PcoSearchAutoCompleteListAsync(int tenantId, string searchText, string entityType, int limit)
        {
            try
            {
                IQueryable<string> query = _dbContext.PCOs
                                            .Where(p => !p.IsDeleted && p.TenantId == tenantId)
                                            .Select(p => p.LastName)
                                            .Distinct()
                                            .OrderBy(p => p)
                                            .Take(limit);

                // Apply filters based on input conditions
                if (!string.IsNullOrEmpty(searchText))
                {
                    query = query.Where(p => p.StartsWith(searchText));
                }

                if (!string.IsNullOrEmpty(entityType))
                {
                    var _entityType = entityType.Equals(EntityType.Person, StringComparison.OrdinalIgnoreCase)
                                                ? EntityType.Person
                                                : EntityType.Company_Organisation;

                    query = _dbContext.PCOs
                        .Where(p => p.EntityType == _entityType && !p.IsDeleted && p.TenantId == tenantId)
                        .Select(p => p.LastName)
                        .Distinct()
                        .OrderBy(p => p)
                        .Take(limit);

                    if (!string.IsNullOrEmpty(searchText))
                    {
                        query = query.Where(p => p.StartsWith(searchText));
                    }
                }

                var PcoName = await query.ToListAsync().ConfigureAwait(false);

                return new PcoSearchAutoCompleteListResponse
                {
                    Data = PcoName,
                    Message = "PCO retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new PcoSearchAutoCompleteListResponse
                {
                    Errors = new List<string>
                                    {
                                        "Oops! Something went wrong while getting records",
                                        ex.InnerException?.ToString() ?? ex.Message
                                    },
                    StatusCode = 500, // Changed to 500 for internal server error
                    Success = false
                };
            }



            //List<string> PcoName = new();
            //var _entityType = string.Empty;
            //try
            //{
            //    if (string.IsNullOrEmpty(searchText) && string.IsNullOrEmpty(entityType))
            //    {
            //        var query = (from a in _dbContext.PCOs.Where(a => a.IsDeleted.Equals(false) && a.TenantId.Equals(tenantId))
            //                     select new
            //                     {
            //                         a.LastName

            //                     }).Distinct().OrderBy(a => a.LastName).Take(limit);
            //        var list = query.ToListAsync();
            //        foreach (var item in await list.ConfigureAwait(false))
            //        {
            //            PcoName.Add(item.LastName); 
            //        } 
            //        return new PcoSearchAutoCompleteListResponse
            //        {
            //            Data = PcoName,
            //            Message = "PCO retrieved successfully",
            //            StatusCode = 200,
            //            Success = true
            //        };


            //    }
            //    else if (!string.IsNullOrEmpty(searchText) && string.IsNullOrEmpty(entityType))
            //    {
            //        var query = (from p in _dbContext.PCOs.Where(p => p.LastName.StartsWith(searchText) && p.IsDeleted.Equals(false) && p.TenantId.Equals(tenantId))
            //                     select new
            //                     {
            //                         p.LastName

            //                     }).Distinct().OrderBy(p => 1).Take(limit);

            //        var list = query.ToListAsync();
            //        foreach (var item in await list.ConfigureAwait(false))
            //        {
            //            PcoName.Add(item.LastName);
            //        }
            //        return new PcoSearchAutoCompleteListResponse
            //        {
            //            Data = PcoName,
            //            Message = "PCO retrieved successfully",
            //            StatusCode = 200,
            //            Success = true
            //        };

            //    }
            //    else if(string.IsNullOrEmpty(searchText) && !string.IsNullOrEmpty(entityType))
            //    {
            //        _entityType = entityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
            //        var query = (from p in _dbContext.PCOs.Where(p => p.EntityType.Equals(_entityType) && p.IsDeleted.Equals(false) && p.TenantId.Equals(tenantId))
            //                     select new
            //                     {
            //                         p.LastName

            //                     }).Distinct().OrderBy(p => 1).Take(limit);

            //        var list = query.ToListAsync();
            //        foreach (var item in await list.ConfigureAwait(false))
            //        {
            //            PcoName.Add(item.LastName);
            //        }
            //        return new PcoSearchAutoCompleteListResponse
            //        {
            //            Data = PcoName,
            //            Message = "PCO retrieved successfully",
            //            StatusCode = 200,
            //            Success = true
            //        };

            //    }
            //    else
            //    {
            //        _entityType = entityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
            //        var query = (from p in _dbContext.PCOs.Where(p => p.LastName.StartsWith(searchText) && p.EntityType.Equals(_entityType) && p.IsDeleted.Equals(false) && p.TenantId.Equals(tenantId))
            //                     select new
            //                     {
            //                         p.LastName

            //                     }).Distinct().OrderBy(p => 1).Take(limit);

            //        var list = query.ToListAsync();
            //        foreach (var item in await list.ConfigureAwait(false))
            //        {
            //            PcoName.Add(item.LastName);
            //        }
            //        return new PcoSearchAutoCompleteListResponse
            //        {
            //            Data = PcoName,
            //            Message = "PCO retrieved successfully",
            //            StatusCode = 200,
            //            Success = true
            //        };
            //    }


            //}
            //catch (Exception ex)
            //{
            //    return new PcoSearchAutoCompleteListResponse
            //    {
            //        Errors = new List<string> { "Oops! Something went wrong while getting records", ex.Message, ex.InnerException.ToString() },
            //        StatusCode = 200,
            //        Success = false
            //    };
            //}
        }

        public async Task<PCODropDownResponse> AutoCompletePcoListAsync(int tenantId, bool isDeleted, string searchText, string entityType, int limit, int page)
        {
            //PaginatedList<PCO> _pcopaginatedlist = new();
            //var _entityType = string.Empty;
            //try
            //{

            //    if (string.IsNullOrEmpty(searchText) && string.IsNullOrEmpty(entityType))
            //    {
            //        _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId)).Distinct().OrderBy(p => p.LastName), page, limit);
            //    }
            //    else
            //    {
            //        if (string.IsNullOrEmpty(entityType) && !string.IsNullOrEmpty(searchText))
            //        {
            //            _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.LastName.StartsWith(searchText)).Distinct().OrderBy(p => p.LastName), page, limit);
            //        }
            //        else if (!string.IsNullOrEmpty(entityType) && string.IsNullOrEmpty(searchText))
            //        {
            //            _entityType = entityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
            //            _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.EntityType.Equals(_entityType)).Distinct().OrderBy(p => p.LastName), page, limit);
            //        }
            //        else
            //        {
            //            _entityType = entityType.ToLower() == EntityType.Person.ToLower() ? EntityType.Person : EntityType.Company_Organisation;
            //            _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(_dbContext.PCOs.Where(p => p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.EntityType.Equals(_entityType) && p.LastName.StartsWith(searchText)).Distinct().OrderBy(p => p.LastName), page, limit);

            //        }
            //    }
            //    List<PcoDropDownVM> _pcoDropDownVM = new();
            //    _pcoDropDownVM = _mapper.Map <List<PcoDropDownVM>>(_pcopaginatedlist);
            //    return new PCODropDownResponse
            //    {
            //        Data = _pcoDropDownVM,
            //        Success = true,
            //        Message ="PCO retrieved successfully!",
            //        StatusCode = 200
            //    };


            //}
            //catch(Exception ex)
            //{
            //    return new PCODropDownResponse
            //    {
            //        Errors = new List<string> {"Oops! Something went wrong while getting records", ex.Message, ex.InnerException.ToString() },
            //        Success = false,
            //        StatusCode = 200
            //    };
            //}

            try
            {
                IQueryable<PCO> query = _dbContext.PCOs
                                        .Where(p => p.IsDeleted == isDeleted && p.TenantId == tenantId)
                                        .Distinct()
                                        .OrderBy(p => p.LastName);

                if (!string.IsNullOrEmpty(entityType))
                {
                    var _entityType = entityType.Equals(EntityType.Person, StringComparison.OrdinalIgnoreCase)
                                                ? EntityType.Person
                                                : EntityType.Company_Organisation;
                    query = query.Where(p => p.EntityType == _entityType);
                }

                if (!string.IsNullOrEmpty(searchText))
                {
                    query = query.Where(p => p.LastName.StartsWith(searchText));
                }

                var _pcopaginatedlist = await PaginatedList<PCO>.CreateAsync(query, page, limit);
                var _pcoDropDownVM = _mapper.Map<List<PcoDropDownVM>>(_pcopaginatedlist);

                return new PCODropDownResponse
                {
                    Data = _pcoDropDownVM,
                    Success = true,
                    Message = "PCO retrieved successfully!",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new PCODropDownResponse
                {
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while getting records",
                                    ex.InnerException?.ToString() ?? ex.Message
                                },
                    Success = false,
                    StatusCode = 200
                };
            }
        }

        public async Task<PCOCountResponse> GetPCOCount(int tenantId)
        {
            try
            {
                var counts = await _dbContext.PCOs
                                .Where(p => p.TenantId == tenantId && !p.IsDeleted)
                                .GroupBy(p => p.EntityType)
                                .Select(g => new
                                {
                                    EntityType = g.Key,
                                    Count = g.Count()
                                })
                                .ToListAsync();

                var personCount = counts.FirstOrDefault(c => c.EntityType == EntityType.Person)?.Count ?? 0;
                var organizationCount = counts.FirstOrDefault(c => c.EntityType == EntityType.Company_Organisation)?.Count ?? 0;

                return new PCOCountResponse
                {
                    Data = new GetPCOCount
                    {
                        OrganizationCount = organizationCount,
                        PersonCount = personCount
                    },
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new PCOCountResponse
                {
                    Success = false,
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while getting count of PCO",
                                    ex.InnerException?.ToString() ?? ex.Message
                                },
                    StatusCode = 200
                };
            }

        }

        public async Task<GetPCOHospitalResponse> GetPCOHospitalsAsync(int tenantId)
        {
            try
            {
                var lstHospitals = await _dbContext.PCOs
                                        .Where(p => p.TenantId == tenantId
                                                    && p.EntityType == EntityType.Company_Organisation
                                                    && p.Hospital
                                                    && !p.IsDeleted)
                                        .Select(hospital => new PCOHospital
                                        {
                                            Id = hospital.Id,
                                            LastNameHospital = hospital.LastName
                                        })
                                        .ToListAsync();

                return new GetPCOHospitalResponse
                {
                    Data = new GetPCOHospital
                    {
                        PCOHospitals = lstHospitals
                    },
                    Success = true,
                    StatusCode = 200,
                    Message = "PCO hospitals retrieved."
                };
            }
            catch (Exception ex)
            {
                return new GetPCOHospitalResponse
                {
                    Success = false,
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while getting PCO hospitals",
                                    ex.InnerException?.ToString() ?? ex.Message // Prevents potential NullReferenceException
                                },
                    StatusCode = 400
                };
            }

        }

        public async Task<GetPCOOtherRescueResponse> GetPCOOtherRescuesAsync(int tenantId)
        {
            try
            {
                var lstRescues = await _dbContext.PCOs
                                        .Where(p => p.TenantId == tenantId
                                                    && p.EntityType == EntityType.Company_Organisation
                                                    && p.Rescue
                                                    && !p.IsDeleted)
                                        .Select(rescue => new PCOOtherRescue
                                        {
                                            Id = rescue.Id,
                                            LastNameOtherRescue = rescue.LastName
                                        })
                                        .ToListAsync();

                return new GetPCOOtherRescueResponse
                {
                    Data = new GetPCOOtherRescueData { PCOOtherRescues = lstRescues },
                    Success = true,
                    StatusCode = 200,
                    Message = "PCO other rescues retrieved."
                };
            }
            catch (Exception ex)
            {
                return new GetPCOOtherRescueResponse
                {
                    Success = false,
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while getting PCO other rescues",
                                    ex.InnerException?.ToString() ?? ex.Message
                                },
                    StatusCode = 400
                };
            }
        }


        //public async Task<PCO?> GetPCOHospitalAsync(int pcoId, int tenantId)
        //{
        //    return await _dbContext.PCOs
        //        .FirstOrDefaultAsync(p => p.Id == pcoId && p.Hospital && p.TenantId == tenantId);
        //}

        public async Task<PCO?> GetPCOHospitalAsync(int pcoId, int tenantId) =>
                   await _dbContext.PCOs
                        .Where(p => p.Id == pcoId && p.Hospital && p.TenantId == tenantId)
                        .FirstOrDefaultAsync();

        public async Task<GetPcoHistoryResponse> GetPcosHistoryAsync(int pcoId, int tenantId)
        {
            try
            {
                var pcosHistory = new List<PcoHistory>();
                DateTime? dateTime = null;

                var user = await _userManager.FindByNameAsync(_userName);
                var blnAdmin = user != null && (await _userManager.IsInRoleAsync(user, UserRoles.Administrator) ||
                                                await _userManager.IsInRoleAsync(user, UserRoles.SuperAdministrator));


                // Animal Milestones by Pco Id

                //Select AnimalMilestones.Id, AnimalMilestones.MilestoneDate, AnimalMilestones.MilestoneType, AnimalMilestones.AmountPaidFee, AnimalMilestones.AmountReceivedFee, Animals.AnimalName, AnimalTypes.TypeName, AnimalMilestones.Notes
                //From AnimalMilestones
                //Inner Join Animals on AnimalMilestones.AnimalId = Animals.Id
                //Inner Join AnimalTypes on Animals.AnimalTypeId = AnimalTypes.Id
                //Where AnimalMilestones.PCOId = 12
                //And AnimalMilestones.IsDeleted = 0
                //Order by AnimalMilestones.MilestoneDate

                var animalMilestones = await _dbContext.AnimalMilestones
                                        .Where(am => !am.IsDeleted && am.PcoId == pcoId && am.TenantId == tenantId) // Apply filters early
                                        .Join(_dbContext.Animals,
                                               am => am.AnimalId,
                                               a => a.Id,
                                               (am, a) => new { am, a })
                                        .Join(_dbContext.AnimalTypes,
                                               ama => ama.a.AnimalTypeId,
                                               at => at.Id,
                                               (ama, at) => new PcoHistory
                                               {
                                                   TenantId = ama.am.TenantId ?? 0,
                                                   AnimalMilestoneId = ama.am.Id,
                                                   AnimalId = ama.a.Id,
                                                   PcoId = ama.am.PcoId ?? 0,
                                                   DonationId = 0,
                                                   VolunteerId = 0,
                                                   PvdId = 0,
                                                   TableName = "Animal Milestone",
                                                   Date = (DateTime?)ama.am.MilestoneDate, //  ?? DateTime.MinValue
                                                   VolDateInactive = dateTime, // DateTime.MinValue
                                                   MilestoneAttachmentType = ama.am.MilestoneType,
                                                   Amount = ama.am.AmountPaidFee,
                                                   MilestoneAmountReceivedFee = ama.am.AmountReceivedFee,
                                                   AnimalType = at.TypeName,
                                                   AnimalName = ama.a.AnimalName,
                                                   Notes = ama.am.Notes,
                                                   AnimalMilestoneDeleted = ama.am.IsDeleted,
                                                   AnimalDeleted = ama.a.IsDeleted,
                                                   DonationDeleted = false,
                                                   VolunteerDeleted = false,
                                                   PvdDeleted = false
                                               })
                                        //.Where(ph => !ph.AnimalMilestoneDeleted && ph.TenantId == tenantId)
                                        .OrderBy(ph => ph.Date)
                                        .ToListAsync();
                // Add Animal Milestones Collection into PCO History Collection
                pcosHistory.AddRange(animalMilestones);

                // Donations by Pco Id

                //Select Donations.Id, Donations.DonationDate, Donations.Amount, Donations.Notes
                //From Donations Where Donations.PCOId = 12 And IsDeleted = 0 Order By Donations.DonationDate
                var donations = new List<PcoHistory>();
                
                if(blnAdmin) // If Administrator then donations will return into PCO history otherwise not
                {
                    donations = await _dbContext.Donations
                                    .Where(d => !d.IsDeleted && d.PcoId == pcoId && d.TenantId == tenantId)
                                    .Select(d => new PcoHistory
                                    {
                                        TenantId = d.TenantId ?? 0,
                                        AnimalMilestoneId = 0,
                                        AnimalId = 0,
                                        PcoId = d.PcoId ?? 0,
                                        DonationId = d.Id,
                                        VolunteerId = 0,
                                        PvdId = 0,
                                        TableName = "Donation",
                                        Date = d.DonationDate ?? DateTime.MinValue,
                                        VolDateInactive = dateTime, //DateTime.MinValue,
                                        MilestoneAttachmentType = d.DonationType,
                                        Amount = d.Amount.HasValue ? (decimal)d.Amount.Value : 0,
                                        MilestoneAmountReceivedFee = 0,
                                        AnimalType = string.Empty,
                                        AnimalName = string.Empty,
                                        Notes = d.Notes,
                                        AnimalMilestoneDeleted = false,
                                        AnimalDeleted = false,
                                        DonationDeleted = d.IsDeleted,
                                        VolunteerDeleted = false,
                                        PvdDeleted = false
                                    })
                                    //.Where(ph => !ph.DonationDeleted && ph.TenantId == tenantId)
                                    .OrderBy(ph => ph.Date)
                                    .ToListAsync();
                    // Add Donations into PCO History Collection
                    pcosHistory.AddRange(donations);
                }
                

                // Volunteer By PcoId

                //Select Volunteers.Id, Volunteers.DateActive, Volunteers.DateInactive, Volunteers.Notes
                //From Volunteers
                //WHERE Volunteers.PCOid = 12
                //Order by Volunteers.DateActive
                var volunteers = await _dbContext.Volunteers
                                    .Where(v => !v.IsDeleted && v.PcoId == pcoId && v.TenantId == tenantId)
                                    .Select(v => new PcoHistory
                                    {
                                        TenantId = v.TenantId ?? 0,
                                        AnimalMilestoneId = 0,
                                        AnimalId = 0,
                                        PcoId = v.PcoId ?? 0,
                                        DonationId = 0,
                                        VolunteerId = v.Id,
                                        PvdId = 0,
                                        TableName = "Volunteer",
                                        Date = v.DateActive,
                                        VolDateInactive = v.DateInactive,
                                        MilestoneAttachmentType = string.Empty,
                                        Amount = 0,
                                        MilestoneAmountReceivedFee = 0,
                                        AnimalType = string.Empty,
                                        AnimalName = string.Empty,
                                        Notes = v.Notes,
                                        AnimalMilestoneDeleted = false,
                                        AnimalDeleted = false,
                                        DonationDeleted = false,
                                        VolunteerDeleted = false,
                                        PvdDeleted = false
                                    })
                                    //.Where(ph => !ph.VolunteerDeleted && ph.TenantId == tenantId)
                                    .OrderBy(ph => ph.Date)
                                    .ToListAsync();
                // Add Volunteers into PCO History Collection
                pcosHistory.AddRange(volunteers);

                // PVD by PcoId

                //Select PVDs.Id, PVDs.AttachmentDate, PVDs.AttachmentType, PVDs.Notes
                //From PVDs
                //WHERE PVDs.PCOid = 12
                //Order by PVDs.AttachmentDate
                var pvds = await _dbContext.ArtifactAttachments
                            .Where(aa => !aa.IsDeleted && aa.PcoId == pcoId && aa.TenantId == tenantId)
                            .Select(aa => new PcoHistory
                            {
                                TenantId = aa.TenantId ?? 0,
                                AnimalMilestoneId = 0,
                                AnimalId = 0,
                                PcoId = aa.PcoId ?? 0,
                                DonationId = 0,
                                VolunteerId = 0,
                                PvdId = aa.Id,
                                TableName = "PVD",
                                Date = aa.AttachmentDate ?? DateTime.MinValue,
                                VolDateInactive = dateTime, //DateTime.MinValue,
                                MilestoneAttachmentType = aa.AttachmentType,
                                Amount = 0,
                                MilestoneAmountReceivedFee = 0,
                                AnimalType = string.Empty,
                                AnimalName = string.Empty,
                                Notes = aa.Notes,
                                AnimalMilestoneDeleted = false,
                                AnimalDeleted = false,
                                DonationDeleted = false,
                                VolunteerDeleted = false,
                                PvdDeleted = aa.IsDeleted
                            })
                            //.Where(ph => !ph.PvdDeleted && ph.TenantId == tenantId)
                            .OrderBy(ph => ph.Date)
                            .ToListAsync();
                // Add PVDs / Artifact Attachments into PCO History Collection
                pcosHistory.AddRange(pvds);

                var lstHistory = pcosHistory.OrderBy(ph => ph.Date).ToList();

                return new GetPcoHistoryResponse {
                    Data = new GetPcoHistoryData { PcosHistory = lstHistory },
                    Success = true,
                    StatusCode = 200,
                    Message = "PCO history retrieved."
                };
            }
            catch (Exception ex)
            {
                return new GetPcoHistoryResponse
                {
                    Success = false,
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while getting PCO history",
                                    ex.InnerException?.ToString() ?? ex.Message
                                },
                    StatusCode = 400
                };
            }
        }
    }
}
