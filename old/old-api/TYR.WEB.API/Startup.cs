using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Serialization;
using TYR.Web.Repositories;
using TYR.Web.Repositories.Interfaces;
using TYR.Web.Repositories.Repositories;
using TYR.WEB.API.CommonHelper;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
      
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var tokenValidationParameters = new TokenValidationParameters { 
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"])),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = Configuration["JWT:ValidAudience"],
                ValidIssuer = Configuration["JWT:ValidIssuer"],
                ValidateLifetime = true,
                RequireExpirationTime = false,

                // Allow to use seconds for expiration of token
                // Required only when token lifetime less than 5 minutes
                // THIS ONE
                ClockSkew = TimeSpan.FromDays(7)
            };

            
            services.AddSingleton(tokenValidationParameters);
            //services.AddAutoMapper(typeof(Startup));
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps("TYR.WEB.Models");
            });
            IMapper mapper = config.CreateMapper();
            services.AddSingleton(mapper);

            //services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddHttpContextAccessor();
            services.AddControllers();
            //services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
            //services.AddControllers()
            //   .AddJsonOptions(options =>
            //   {
            //       options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            //   });
            //services.AddControllers().AddNewtonsoftJson(x =>
            //    x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddDbContext<TYRDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("TYRConnection")));
            services.AddIdentityCore<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
               .AddRoles<IdentityRole>()
              .AddEntityFrameworkStores<TYRDbContext>();
            services.Configure<IdentityOptions>(opts => {
                opts.Password.RequiredLength = 8;
                opts.Password.RequireNonAlphanumeric = true;
                opts.Password.RequireLowercase = false;
                opts.Password.RequireUppercase = true;
                opts.Password.RequireDigit = true;
            });
          
            //services.AddTransient<IRepositoryBase, RepositoryBase>();
            services.AddTransient<IAnimalTypeService, AnimalTypeService>();
            services.AddTransient<IAnimalTypeRepository, AnimalTypeRepository>();
            services.AddTransient<ISAAnimalTypeService, SAAnimalTypeService>();
            services.AddTransient<ISAAnimalTypeRepository, SAAnimalTypeRepository>();
            services.AddTransient<IAnimalMilestoneService, AnimalMilestoneService>();
            services.AddTransient<IAnimalMilestoneRepository, AnimalMilestoneRepository>();
            services.AddTransient<IAcquisitionWayService, AcquisitionWayService>();
            services.AddTransient<IBehaviorRepository, BehaviorRepository>();
            services.AddTransient<IBehaviorService, BehaviorService>();
            services.AddTransient<IHealthProcedureRepository, HealthProcedureRepository>();
            services.AddTransient<IHealthProcedureService, HealthProcedureService>();
            services.AddTransient<IAcquisitionWayRepository, AcquisitionWayRepository>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IUserRoleRepository, UserRoleRepository>();
            services.AddTransient<IUserRoleService, UserRoleService>();
            services.AddTransient<ITenantService, TenantService>();
            services.AddTransient<ITenantRepository, TenantRepository>();
            services.AddTransient<IRefreshTokenService, RefreshTokenService>();
            services.AddTransient<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddTransient<IEmailRepository, EmailRepository>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IPCORepository, PCORepository>();
            services.AddTransient<IPCOService, PCOService>();
            services.AddTransient<IAnimalRepository, AnimalRepository>();
            services.AddTransient<IAnimalService, AnimalService>();
            services.AddTransient<IAnimalNameRepository, AnimalNameRepository>();
            services.AddTransient<IAnimalNameService, AnimalNameService>();
            services.AddTransient<IVaccinationTypeRepository, VaccinationTypeRepository>();
            services.AddTransient<IVaccinationTypeService, VaccinationTypeService>();
            services.AddTransient<IVolunteerActivityRepository, VolunteerActivityRepository>();
            services.AddTransient<IVolunteerActivityService, VolunteerActivityService>();
            services.AddTransient<IMedicineRepository, MedicineRepository>();
            services.AddTransient<IMedicineService, MedicineService>();
            services.AddTransient<ICountryRepository, CountryRepository>();
            services.AddTransient<ICountryService, CountryService>();
            services.AddTransient<IArtifactAttachmentRepository, ArtifactAttachmentRepository>();
            services.AddTransient<IArtifactAttachmentService, ArtifactAttachmentService>();
            services.AddTransient<IAnimalBehaviorRepository, AnimalBehaviorRepository>();
            services.AddTransient<IAnimalBehaviorService, AnimalBehaviorService>();
            services.AddTransient<IAnimalProcedureRepository, AnimalProcedureRepository>();
            services.AddTransient<IAnimalProcedureService, AnimalProcedureService>();
            services.AddTransient<IAnimalVaccinationRepository, AnimalVaccinationRepository>();
            services.AddTransient<IAnimalVaccinationService, AnimalVaccinationService>();
            services.AddTransient<IDiaryRepository, DiaryRepository>();
            services.AddTransient<IDiaryService, DiaryService>();
            services.AddTransient<IMedRepository, MedRepository>();
            services.AddTransient<IMedService, MedService>();
            services.AddTransient<IDonationRepository, DonationRepository>();
            services.AddTransient<IDonationService, DonationService>();
            services.AddTransient<ISABehaviorRepository, SABehaviorRepository>();
            services.AddTransient<ISABehaviorService, SABehaviorService>();
            services.AddTransient<ISAHealthProcedureRepository, SAHealthProcedureRepository>();
            services.AddTransient<ISAHealthProcedureService, SAHealthProcedureService>();
            services.AddTransient<ISAVaccinationTypeRepository, SAVaccinationTypeRepository>();
            services.AddTransient<ISAVaccinationTypeService, SAVaccinationTypeService>();
            services.AddTransient<ISAVolunteerActivityRepository, SAVolunteerActivityRepository>();
            services.AddTransient<ISAVolunteerActivityService, SAVolunteerActivityService>();
            services.AddTransient<ISAMedicineRepository, SAMedicineRepository>();
            services.AddTransient<ISAMedicineService, SAMedicineService>();
            services.AddTransient<ISOAPRepository, SOAPRepository>();
            services.AddTransient<ISOAPService, SOAPService>();
            services.AddTransient<IHealthNoteRepository, HealthNoteRepository>();
            services.AddTransient<IHealthNoteService, HealthNoteService>();
            services.AddTransient<IHealthHistoryRepository, HealthHistoryRepository>();
            services.AddTransient<IHealthHistoryService, HealthHistoryService>();
            services.AddTransient<IQueryRepository, QueryRepository>();
            services.AddTransient<IQueryService, QueryService>();
            services.AddTransient<IOtpRepository, OtpRepository>();
            services.AddTransient<IOtpService, OtpService>();
            services.AddTransient<ISearchRepository, SearchRepository>();
            services.AddTransient<ISearchService, SearchService>();
            services.AddTransient<IReportRepository, ReportRepository>();
            services.AddTransient<IReportService, ReportService>();
            services.AddTransient<IVolunteerRepository, VolunteerRepository>();
            services.AddTransient<IVolunteerService, VolunteerService>();
            services.AddTransient<IVolunteerPersonActivityRepository, VolunteerPersonActivityRepository>();
            services.AddSwaggerGen(swagger =>
            {
                //This is to generate the Default UI of Swagger Documentation
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "TYR.WEB.API",
                    Description = "Authentication and Authorization with JWT and Swagger"
                });
                // To Enable authorization using Swagger (JWT)
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter ‘Bearer’ [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                });
                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            // For Identity
            services.AddIdentity<ApplicationUser, IdentityRole>(opt => {
                opt.SignIn.RequireConfirmedEmail = true;
                opt.Tokens.EmailConfirmationTokenProvider = "emailconfirmation";
            })
                .AddEntityFrameworkStores<TYRDbContext>()
                .AddDefaultTokenProviders()
                .AddTokenProvider<EmailConfirmationTokenProvider<ApplicationUser>>("emailconfirmation");

            //Set Email Token Expiration for 7 days 
            services.Configure<EmailConfirmationTokenProviderOptions>(opt =>
                 opt.TokenLifespan = TimeSpan.FromMinutes(Convert.ToDouble(Configuration["TokenExpiry:Minutes"].ToString())));
            // Adding Authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            // Adding Jwt Bearer
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = tokenValidationParameters;
                //options.TokenValidationParameters = new TokenValidationParameters()
                //{
                //    ValidateIssuer = true,
                //    ValidateAudience = true,
                //    ValidAudience = Configuration["JWT:ValidAudience"],
                //    ValidIssuer = Configuration["JWT:ValidIssuer"],
                //    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]))
                //};
            });
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("https://localhost:44351", "http://localhost:3000", "https://tyrwebapi.azurewebsites.net", "https://tyr-api.azurewebsites.net", "https://tyrclient.azurewebsites.net", "*")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, TYRDbContext tYRDbContext)
        {
            // migrate any database changes on startup (includes initial db creation)
            tYRDbContext.Database.Migrate();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TYR.WEB.API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            //app.UseCors("Open");
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
