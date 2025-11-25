using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class UpdateArtifactOriginalFileName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(541),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(5023));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(204),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(4655));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(4882),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(3890));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(4504),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(3492));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(5158),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 870, DateTimeKind.Local).AddTicks(9098));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(4812),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 870, DateTimeKind.Local).AddTicks(8703));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 161, DateTimeKind.Local).AddTicks(9540),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 865, DateTimeKind.Local).AddTicks(7636));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 160, DateTimeKind.Local).AddTicks(8510),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 864, DateTimeKind.Local).AddTicks(7545));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(7339),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(6718));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(7004),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(6353));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(6751),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(2823));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(6446),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(2497));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(3784),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 867, DateTimeKind.Local).AddTicks(2131));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(4154),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 867, DateTimeKind.Local).AddTicks(2500));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(8118),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(6268));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(7777),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(5888));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(9055),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(6525));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(8792),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(6236));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(7539),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(1737));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(7204),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(1312));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(4347),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(2206));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(3526),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(1349));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(1147),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(9402));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(799),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(9007));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(5058),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(4083));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(4791),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(3773));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(4087),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(1248));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(3843),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(977));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(2409),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(7102));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(8520),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(3686));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(8273),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(3408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(5421),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(129));

            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "Attachments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(642),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(7436));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(372),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(7134));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(3073),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(8765));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(2798),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(8451));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(7559),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(7599));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(7192),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(6399));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 169, DateTimeKind.Local).AddTicks(5293),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(1709));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 169, DateTimeKind.Local).AddTicks(5029),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(1410));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(3928),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 5, 27, 14, 21, 10, 870, DateTimeKind.Local).AddTicks(7598));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 165, DateTimeKind.Local).AddTicks(7148),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 869, DateTimeKind.Local).AddTicks(9722));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 165, DateTimeKind.Local).AddTicks(6791),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 869, DateTimeKind.Local).AddTicks(9077));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 169, DateTimeKind.Local).AddTicks(186),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(6437));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(9844),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(6080));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalFileName",
                table: "Attachments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(5023),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(541));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(4655),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(204));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(3890),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(4882));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(3492),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(4504));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 870, DateTimeKind.Local).AddTicks(9098),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(5158));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 870, DateTimeKind.Local).AddTicks(8703),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(4812));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 865, DateTimeKind.Local).AddTicks(7636),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 161, DateTimeKind.Local).AddTicks(9540));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 864, DateTimeKind.Local).AddTicks(7545),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 160, DateTimeKind.Local).AddTicks(8510));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(6718),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(7339));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(6353),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(7004));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(2823),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(6751));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(2497),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(6446));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 867, DateTimeKind.Local).AddTicks(2131),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(3784));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 867, DateTimeKind.Local).AddTicks(2500),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(4154));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(6268),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(8118));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(5888),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(7777));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(6525),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(9055));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(6236),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(8792));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(1737),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(7539));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(1312),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(7204));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(2206),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(4347));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(1349),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 162, DateTimeKind.Local).AddTicks(3526));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(9402),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(1147));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 866, DateTimeKind.Local).AddTicks(9007),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 163, DateTimeKind.Local).AddTicks(799));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(4083),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(5058));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 876, DateTimeKind.Local).AddTicks(3773),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 171, DateTimeKind.Local).AddTicks(4791));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(1248),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(4087));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 875, DateTimeKind.Local).AddTicks(977),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(3843));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 871, DateTimeKind.Local).AddTicks(7102),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(2409));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(3686),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(8520));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(3408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(8273));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(129),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 167, DateTimeKind.Local).AddTicks(5421));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(7436),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(642));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(7134),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 170, DateTimeKind.Local).AddTicks(372));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(8765),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(3073));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 872, DateTimeKind.Local).AddTicks(8451),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(2798));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(7599),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(7559));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 868, DateTimeKind.Local).AddTicks(6399),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 164, DateTimeKind.Local).AddTicks(7192));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(1709),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 169, DateTimeKind.Local).AddTicks(5293));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 874, DateTimeKind.Local).AddTicks(1410),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 169, DateTimeKind.Local).AddTicks(5029));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 5, 27, 14, 21, 10, 870, DateTimeKind.Local).AddTicks(7598),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 6, 5, 18, 9, 53, 166, DateTimeKind.Local).AddTicks(3928));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 869, DateTimeKind.Local).AddTicks(9722),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 165, DateTimeKind.Local).AddTicks(7148));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 869, DateTimeKind.Local).AddTicks(9077),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 165, DateTimeKind.Local).AddTicks(6791));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(6437),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 169, DateTimeKind.Local).AddTicks(186));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 5, 27, 14, 21, 10, 873, DateTimeKind.Local).AddTicks(6080),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 6, 5, 18, 9, 53, 168, DateTimeKind.Local).AddTicks(9844));
        }
    }
}
