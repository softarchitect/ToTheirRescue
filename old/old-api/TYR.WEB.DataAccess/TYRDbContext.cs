using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.DataAccess.IdentityAuth;

namespace TYR.WEB.DataAccess
{
#pragma warning disable S101 // Types should be named in PascalCase
    public class TYRDbContext : IdentityDbContext<ApplicationUser>
#pragma warning restore S101 // Types should be named in PascalCase
    {
        public TYRDbContext(DbContextOptions<TYRDbContext> options): base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .Property(e => e.FirstName)
                .HasMaxLength(250)
                .HasColumnType("nvarchar");

            builder.Entity<ApplicationUser>()
                .Property(e => e.LastName)
                .HasMaxLength(250)
                .HasColumnType("nvarchar");
            builder.Entity<ApplicationUser>()
                .Property(e => e.AlternateEmailAddress)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .IsRequired(false);
            builder.Entity<ApplicationUser>()
                .Property(e => e.DateEntered)
                .HasColumnName("DateEntered")
                .HasColumnType("datetime2")
                .ValueGeneratedOnAdd(); 

            builder.Entity<ApplicationUser>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnName("EnteredBy")
                .HasColumnType("nvarchar");
            builder.Entity<ApplicationUser>()
                .Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("Status")
                .HasColumnType("nvarchar");
            builder.Entity<ApplicationUser>()
                .Property(e => e.DateActive)
                .HasColumnName("DateActive")
                .HasColumnType("datetime2");
            builder.Entity<ApplicationUser>()
                .Property(e => e.DateInactive)
                .HasColumnName("DateInactive")
                .HasColumnType("datetime2");
            builder.Entity<ApplicationUser>()
                .Property(e => e.Notes)
                .HasColumnName("Notes")
                .HasMaxLength(4000)
                .HasColumnType("nvarchar");
            builder.Entity<ApplicationUser>()
                .Property(e => e.DateInvited)
                .HasColumnName("DateInvited")
                .HasColumnType("datetime2");
            builder.Entity<ApplicationUser>()
                .Property(e => e.Inviter)
                .HasColumnName("Inviter")
                .HasColumnType("nvarchar")
                .HasMaxLength(256);
            builder.Entity<ApplicationUser>()
                .Property(e => e.TenantId)
                .HasColumnName("TenantId")
                .HasColumnType("int");
            builder.Entity<ApplicationUser>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            builder.Entity<Tenant>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Tenant>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Tenant>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Name)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.TenantAcronym)
                .HasMaxLength(25)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Street)
                .HasMaxLength(512)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.City)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.State)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Zip)
                .HasMaxLength(15)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Website)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.Notes)
                .HasMaxLength(4000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.EmailAddress)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Tenant>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // HealthProcedure
            builder.Entity<HealthProcedure>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<HealthProcedure>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<HealthProcedure>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<HealthProcedure>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<HealthProcedure>()
                .Property(e => e.Kind)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<HealthProcedure>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // Behavior
            builder.Entity<Behavior>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Behavior>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Behavior>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Behavior>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Behavior>()
                .Property(e => e.BehaviorName)
                .HasMaxLength(75)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Behavior>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            builder.Entity<PCO>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<PCO>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<PCO>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.LastName)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Street)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Street2)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.City)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.State)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Zip)
                .HasMaxLength(15)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.OtherPhone)
                .HasMaxLength(20)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.MailList)
                .HasDefaultValue(false);
            builder.Entity<PCO>()
                .Property(e => e.Website)
                .HasMaxLength(100)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Contact)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.RescueContact)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Notes)
                .HasMaxLength(4000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.EntityType)
                .HasMaxLength(10)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.Hospital)
                .HasDefaultValue(false);
            builder.Entity<PCO>()
                .Property(e => e.Rescue)
                .HasDefaultValue(false);
            builder.Entity<PCO>()
                .Property(e => e.Flag)
                .HasDefaultValue(false);
            builder.Entity<PCO>()
                .Property(e => e.FlagReason)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<PCO>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<PCO>()
                .Property(e => e.CountryId)
                .HasDefaultValue(0);
            
            builder.Entity<Animal>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Animal>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Animal>()
                .Property(e => e.EnteredBy)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.ModifiedBy)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<Animal>()
                .Property(e => e.AnimalName)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.Location)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.CurrentResident)
                .HasDefaultValue(true);
            builder.Entity<Animal>()
                .Property(e => e.Breed)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.Color)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.Sex)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.SpayedOrNeutered)
                .HasDefaultValue(false);
            builder.Entity<Animal>()
                .Property(e => e.LastMilestone)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.Notes)
                .HasDefaultValue(string.Empty);
            //builder.Entity<Animal>()
            //    .Property(e => e.OtherIDNo)
            //    .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.Flag)
                .HasDefaultValue(false);
            builder.Entity<Animal>()
                .Property(e => e.FlagReason)
                .HasDefaultValue(string.Empty);
            builder.Entity<Animal>()
                .Property(e => e.PcoId)
                .HasDefaultValue(0);
            builder.Entity<Animal>()
                .Property(e => e.ChronicCondition)
                .HasDefaultValue(string.Empty)
                .HasMaxLength(50);
            builder.Entity<Animal>()
                .Property(e => e.Status)
                .HasDefaultValue(string.Empty)
                .HasMaxLength(25);
            builder.Entity<Animal>()
                .Property(e => e.AnimalTypeName)
                .HasDefaultValue(string.Empty)
                .HasMaxLength(25);
            builder.Entity<Animal>()
                .Property(e => e.Diet)
                .HasDefaultValue(string.Empty)
                .HasMaxLength(1000);
            builder.Entity<Animal>()
                .Property(e => e.PublicityBlurb)
                .HasDefaultValue(string.Empty)
                .HasMaxLength(2000);

            builder.Entity<AnimalMilestone>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.MilestoneType)
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.PcoId)
                .HasDefaultValue(1);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.OtherRescueIDNo)
                .HasDefaultValue(string.Empty)
                .HasMaxLength(25)
                .HasColumnType("nvarchar");

            builder.Entity<AnimalMilestone>()
                .Property(e => e.AmountPaidFee)
                .HasDefaultValue(0.0);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.AmountReceivedFee)
                .HasDefaultValue(0.0);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.Notes)
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.ModifiedBy)
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.AcquisitionWayName)
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalMilestone>()
                .Property(e => e.MilestoneDate)
                .HasDefaultValue(DateTime.Now.AddYears(-100));

            builder.Entity<VaccinationType>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<VaccinationType>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<VaccinationType>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<VaccinationType>()
                .Property(e => e.Kind)
                .HasDefaultValue(string.Empty);

            // Medicine
            builder.Entity<Medicine>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Medicine>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Medicine>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<Medicine>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Medicine>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Medicine>()
                .Property(e => e.MedicineName)
                .HasMaxLength(255)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Medicine>()
                .Property(e => e.Formulation)
                .HasDefaultValue(string.Empty);
            builder.Entity<Medicine>()
                .Property(e => e.Notes)
                .HasDefaultValue(string.Empty);
            builder.Entity<Medicine>()
                .Property(e => e.UsedFor)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // VolunteerActivity
            builder.Entity<VolunteerActivity>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<VolunteerActivity>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<VolunteerActivity>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<VolunteerActivity>()
                .Property(e => e.VolunteerActivityName)
                .HasDefaultValue(string.Empty);

            builder.Entity<Country>()
               .Property(e => e.DateEntered)
               .HasDefaultValue(DateTime.Now);
            builder.Entity<Country>()
                .Property(e => e.CountryName)
                .HasDefaultValue(string.Empty);
            builder.Entity<Country>()
                .Property(e => e.ISO2Code)
                .HasMaxLength(3)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Country>()
                .Property(e => e.ISDCode)
                .HasDefaultValue(0);

            builder.Entity<ArtifactAttachment>()
                .Property(e => e.Entity)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.AttachmentType)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.OriginalFileName)
                .HasMaxLength(100)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.FileName)
                .HasMaxLength(100)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.FileNameExtension)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.AttachmentDate)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.PublicityRank)
                .HasDefaultValue(1);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.SequenceNo)
                .HasDefaultValue(1);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.Notes)
                .HasMaxLength(1000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.OriginalBlobUrl)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.BlobUrl)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.ThumbnailBlobUrl)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.PcoId);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.AnimalId)
                .HasDefaultValue(0);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.TenantId)
                .HasDefaultValue(0);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.Person)
                .HasMaxLength(360)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<ArtifactAttachment>()
                .Property(e => e.Animal)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            
            // AnimalType
            builder.Entity<AnimalType>()
               .Property(e => e.DateEntered)
               .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalType>()
                .Property(e => e.TypeName)
                .HasMaxLength(25)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalType>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalType>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalType>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalType>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalType>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<AnimalType>()
                .Property(e => e.TenantId)
                .HasDefaultValue(0);
            builder.Entity<AnimalType>()
                .Property(e => e.RoleName)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // SAAnimalType
            builder.Entity<SAAnimalType>()
                .Property(e => e.TypeName)
                .HasMaxLength(25)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAAnimalType>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAAnimalType>()
                .Property(e => e.DateModified) 
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAAnimalType>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAAnimalType>()
                .Property(e => e.ModifiedBy) 
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAAnimalType>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // AnimalBehavior
            builder.Entity<AnimalBehavior>()
                .Property(e => e.YesOrNo)
                .HasDefaultValue(false);
            builder.Entity<AnimalBehavior>()
                .Property(e => e.Notes)
                .HasColumnType("nvarchar")
                .HasMaxLength(75)
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalBehavior>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalBehavior>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalBehavior>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalBehavior>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalBehavior>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // AnimalProcedure
            builder.Entity<AnimalProcedure>()
                .Property(e => e.Reminder)
                .HasDefaultValue(false);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.DueDate)
                .HasColumnType("datetime2");
            builder.Entity<AnimalProcedure>()
                .Property(e => e.ActionDate)
                .HasColumnType("datetime2");
            builder.Entity<AnimalProcedure>()
                .Property(e => e.Weight)
                .HasMaxLength(20)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            //builder.Entity<AnimalProcedure>()
            //    .Property(e => e.Clinic)
            //    .HasMaxLength(75)
            //    .HasColumnType("nvarchar")
            //    .HasDefaultValue(string.Empty);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.Administerer)
                .HasMaxLength(75)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.Results)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.MicrochipNumber)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.Notes)
                .HasMaxLength(2000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalProcedure>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // AnimalVaccination
            builder.Entity<AnimalVaccination>()
                .Property(e => e.Reminder)
                .HasDefaultValue(false);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.DueDate)
                .HasColumnType("datetime2");
            builder.Entity<AnimalVaccination>()
                .Property(e => e.ActionDate)
                .HasColumnType("datetime2");
            builder.Entity<AnimalVaccination>()
                .Property(e => e.Administerer)
                .HasMaxLength(75)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.TagNumber)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.VaccineSerialNo)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.VaccineManufacturer)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            //builder.Entity<AnimalVaccination>()
            //    .Property(e => e.VaccineExpirationDate)
            //    .HasColumnType("datetime2");
            builder.Entity<AnimalVaccination>()
                .Property(e => e.Notes)
                .HasMaxLength(2000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.DueAgain)
                .HasMaxLength(30)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.VaccRecordNo)
                .HasMaxLength(30)
                .HasDefaultValue(0);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<AnimalVaccination>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // Diary
            builder.Entity<Diary>()
                .Property(e => e.Animal)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Diary>()
                .Property(e => e.TenantOrAnimal)
                .HasMaxLength(30)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Diary>()
                .Property(e => e.ActionDate)
                .HasColumnType("datetime2");
            builder.Entity<Diary>()
                .Property(e => e.Notes)
                .HasMaxLength(2000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Diary>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<Diary>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Diary>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Diary>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Diary>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // Med
            builder.Entity<Med>()
                .Property(e => e.PrescriptionRecordNo)
                .HasDefaultValue(0);
            builder.Entity<Med>()
                .Property(e => e.Reminder)
                .HasDefaultValue(false);
            builder.Entity<Med>()
                .Property(e => e.AdministeredDate)
                .HasColumnType("datetime2");
            builder.Entity<Med>()
                .Property(e => e.DueDate)
                .HasColumnType("datetime2");
            builder.Entity<Med>()
                .Property(e => e.Dosage)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Med>()
                .Property(e => e.Notes)
                .HasMaxLength(2000)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            //builder.Entity<Med>()
            //    .Property(e => e.Administered)
            //    .HasDefaultValue (false);
            builder.Entity<Med>()
                .Property(e => e.AdministeredBy)
                .HasMaxLength(75)
                .HasColumnType("nvarchar")
                .HasDefaultValue (string.Empty);
            builder.Entity<Med>()
                .Property(e => e.Clinic)
                .HasMaxLength(75)
                .HasColumnType("nvarchar")
                .HasDefaultValue (string.Empty);
            builder.Entity<Med>()
                .Property (e => e.Veterinarian)
                .HasMaxLength(50)
                .HasColumnType("nvarchar")
                .HasDefaultValue (string.Empty);
            builder.Entity<Med>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<Med>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Med>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Med>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Med>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // Donation
            builder.Entity<Donation>()
                .Property(e => e.DonationDate)
                .HasColumnType("datetime2");
            builder.Entity<Donation>()
                .Property(e => e.Amount)
                .HasDefaultValue(0.0);
            builder.Entity<Donation>()
                .Property(e => e.DonationType)
                .HasMaxLength(30)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Donation>()
                .Property(e => e.Notes)
                .HasColumnType("nvarchar")
                .HasMaxLength(2000)
                .HasDefaultValue(string.Empty);
            builder.Entity<Donation>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<Donation>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Donation>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Donation>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<Donation>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);

            // SABehavior
            builder.Entity<SABehavior>()
                .Property(e => e.BehaviorName)
                .HasMaxLength(75)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SABehavior>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SABehavior>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SABehavior>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SABehavior>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SABehavior>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // SAHealthProcedure
            builder.Entity<SAHealthProcedure>()
                .Property(e => e.Kind)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAHealthProcedure>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAHealthProcedure>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAHealthProcedure>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAHealthProcedure>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAHealthProcedure>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // SAVaccinationType
            builder.Entity<SAVaccinationType>()
                .Property(e => e.Kind)
                .HasMaxLength(150)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAVaccinationType>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAVaccinationType>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAVaccinationType>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAVaccinationType>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAVaccinationType>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // SAVolunteerActivity
            builder.Entity<SAVolunteerActivity>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAVolunteerActivity>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAVolunteerActivity>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAVolunteerActivity>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAVolunteerActivity>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<SAVolunteerActivity>()
                .Property(e => e.SAVolunteerActivityName)
                .HasDefaultValue(string.Empty);

            // SAMedicine
            builder.Entity<SAMedicine>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAMedicine>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SAMedicine>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAMedicine>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SAMedicine>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);
            builder.Entity<SAMedicine>()
                .Property(e => e.MedicineName)
                .HasDefaultValue(string.Empty);
            builder.Entity<SAMedicine>()
                .Property(e => e.Formulation)
                .HasDefaultValue(string.Empty);
            builder.Entity<SAMedicine>()
                .Property(e => e.Notes)
                .HasDefaultValue(string.Empty);
            builder.Entity<SAMedicine>()
                .Property(e => e.UsedFor)
                .HasDefaultValue(string.Empty);

            // SOAP
            builder.Entity<SOAP>()
                .Property(e => e.ActionDate)
                .HasColumnType("datetime2");
            builder.Entity<SOAP>()
                .Property(e => e.Subjective)
                .HasColumnType("nvarchar")
                .HasMaxLength(4000)
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.Objective)
                .HasColumnType("nvarchar")
                .HasMaxLength(4000)
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.Assessment)
                .HasColumnType("nvarchar")
                .HasMaxLength(4000)
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.SOAPPlan)
                .HasColumnType("nvarchar")
                .HasMaxLength(4000)
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.Veterinarian)
                .HasColumnType("nvarchar")
                .HasMaxLength(75)
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SOAP>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<SOAP>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<SOAP>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // HealthNote
            builder.Entity<HealthNote>()
                .Property(e => e.Note)
                .HasColumnType("nvarchar")
                .HasMaxLength(1000)
                .HasDefaultValue(string.Empty);
            builder.Entity<HealthNote>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<HealthNote>()
                .Property(e => e.ActionDate)
                .HasColumnType("datetime2");
            builder.Entity<HealthNote>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<HealthNote>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<HealthNote>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<HealthNote>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // OTP
            builder.Entity<OTP>()
                .Property(e => e.Email)
                .HasColumnType("nvarchar")
                .HasMaxLength(256)
                .HasDefaultValue(string.Empty);
            builder.Entity<OTP>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<OTP>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<OTP>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<OTP>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<OTP>()
                .Property(e => e.IsEmailOtpVerified)
                .HasDefaultValue(false);

            // Volunteer
            builder.Entity<Volunteer>()
                .Property(e => e.Notes)
                .HasColumnType("nvarchar")
                .HasMaxLength(4000)
                .HasDefaultValue(string.Empty);
            builder.Entity<Volunteer>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Volunteer>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<Volunteer>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue (string.Empty);
            builder.Entity<Volunteer>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue (string.Empty);
            builder.Entity<Volunteer>()
                .Property(e => e.DateActive)
                .HasDefaultValue(DateTime.Now);
            builder.Entity <Volunteer>()
                .Property(e => e.DateInactive);
            builder.Entity<Volunteer>()
                .Property(e => e.Active)
                .HasDefaultValue(true);
            builder.Entity<Volunteer>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            // VolunteerPersonActivity
            builder.Entity<VolunteerPersonActivity>()
                .Property(e => e.DateEntered)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<VolunteerPersonActivity>()
                .Property(e => e.DateModified)
                .HasDefaultValue(DateTime.Now);
            builder.Entity<VolunteerPersonActivity>()
                .Property(e => e.EnteredBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue (string.Empty);
            builder.Entity<VolunteerPersonActivity>()
                .Property(e => e.ModifiedBy)
                .HasMaxLength(256)
                .HasColumnType("nvarchar")
                .HasDefaultValue(string.Empty);
            builder.Entity<VolunteerPersonActivity>()
                .Property(e => e.IsDeleted)
                .HasDefaultValue(false);

        }
        public virtual DbSet<Tenant> Tenants { get; set; }
        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
        public virtual DbSet<AnimalType> AnimalTypes { get; set; }
        public virtual DbSet<SAAnimalType> SAAnimalTypes { get; set; }
        public virtual DbSet<AcquisitionWay> AcquisitionWays { get; set; }
        public virtual DbSet<Behavior> Behaviors { get; set; }
        public virtual DbSet<HealthProcedure> HealthProcedures { get; set; }
        public virtual DbSet<PCO> PCOs { get; set; }
        public virtual DbSet<Animal> Animals { get; set; }
        public virtual DbSet<AnimalName> AnimalNames { get; set; }
        public virtual DbSet<AnimalMilestone> AnimalMilestones { get; set; }
        public virtual DbSet<VaccinationType> VaccinationTypes { get; set; }
        public virtual DbSet<Medicine> Medicines { get; set; }
        public virtual DbSet<VolunteerActivity> VolunteerActivities { get; set; } 
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<ArtifactAttachment> ArtifactAttachments { get; set; }
        public virtual DbSet<AnimalBehavior> AnimalBehaviors { get; set; }
        public virtual DbSet<AnimalProcedure> AnimalProcedures { get; set; }
        public virtual DbSet<AnimalVaccination> AnimalVaccinations { get; set; }
        public virtual DbSet<Diary> Diary { get; set; }
        public virtual DbSet<Med> Meds { get; set; }
        public virtual DbSet<Donation> Donations { get; set; }
        public virtual DbSet<SABehavior> SABehaviors { get; set; }
        public virtual DbSet<SAHealthProcedure> SAHealthProcedures { get; set; }
        public virtual DbSet<SAVaccinationType> SAVaccinationTypes { get; set; }
        public virtual DbSet<SAVolunteerActivity> SAVolunteerActivities { get; set; }
        public virtual DbSet<SAMedicine> SAMedicines { get; set; }
        public virtual DbSet<SOAP> SOAPs { get; set; }
        public virtual DbSet<HealthNote> HealthNotes { get; set; }
        public virtual DbSet<OTP> OTPs { get; set; }
        public virtual DbSet<Volunteer> Volunteers { get; set; }
        public virtual DbSet<VolunteerPersonActivity> VolunteerPersonActivities { get; set; }

    }
    
}
