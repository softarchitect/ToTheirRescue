using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class UpdateBehaviorTenant : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(5625),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8453));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(5308),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8075));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 365, DateTimeKind.Local).AddTicks(7490),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9622));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 365, DateTimeKind.Local).AddTicks(7155),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9202));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(498),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2549));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2153));

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Tenants",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(15)",
                oldMaxLength: 15,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(2399),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 399, DateTimeKind.Local).AddTicks(9510));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 362, DateTimeKind.Local).AddTicks(3742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 398, DateTimeKind.Local).AddTicks(9788));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(6924),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(875));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(6634),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(532));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(4983),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8595));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(4689),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8249));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(8925),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(3262));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(8628),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(2916));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(2376),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5526));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(2073),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(9638),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2497));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(9332),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2150));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(1448),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(7066));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(1167),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(6742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(7455),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4184));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(7767),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4561));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(9607),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(8204));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(9291),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(7816));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(2108),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2698));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(1865),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2406));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(2856),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(5063));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(2540),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(4682));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(6097),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3996));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(5355),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3107));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(2492),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(1310));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(2169),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(928));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(7504),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(7259),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9472));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(7484),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6911));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(7255),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6640));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(7327),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(634));

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Behaviors",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Behaviors",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(4821),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BehaviorName",
                table: "Behaviors",
                type: "nvarchar(75)",
                maxLength: 75,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(75)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(5137));

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Behaviors",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(3783),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(8158));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(3563),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(7906));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(1442),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(5455));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(4110),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(3067));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(3869),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(2767));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(7988),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(3101));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(7742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(2813));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 366, DateTimeKind.Local).AddTicks(4),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2594));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 365, DateTimeKind.Local).AddTicks(9667),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2190));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(9214),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6527));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(8972),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6226));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 7, 16, 18, 40, 4, 367, DateTimeKind.Local).AddTicks(9334),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(1013));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 367, DateTimeKind.Local).AddTicks(3012),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(3125));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 367, DateTimeKind.Local).AddTicks(2674),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(2728));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(4562),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(821));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(4261),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(461));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "Behaviors");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Behaviors");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8453),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(5625));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8075),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(5308));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9622),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 365, DateTimeKind.Local).AddTicks(7490));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9202),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 365, DateTimeKind.Local).AddTicks(7155));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2549),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(498));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2153),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(177));

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Tenants",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 399, DateTimeKind.Local).AddTicks(9510),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(2399));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 398, DateTimeKind.Local).AddTicks(9788),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 362, DateTimeKind.Local).AddTicks(3742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(875),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(6924));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(532),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(6634));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8595),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(4983));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8249),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(4689));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(3262),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(8925));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(2916),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(8628));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5526),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(2376));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 373, DateTimeKind.Local).AddTicks(2073));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2497),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(9638));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2150),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(9332));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(7066),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(1448));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(6742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(1167));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4184),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(7455));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4561),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(7767));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(8204),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(9607));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(7816),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(9291));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2698),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(2108));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2406),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(1865));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(5063),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(2856));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(4682),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(2540));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3996),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(6097));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3107),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 363, DateTimeKind.Local).AddTicks(5355));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(1310),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(2492));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(928),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(2169));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(7504));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9472),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 372, DateTimeKind.Local).AddTicks(7259));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6911),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(7484));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6640),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(7255));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(634),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 368, DateTimeKind.Local).AddTicks(7327));

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Behaviors",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Behaviors",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 364, DateTimeKind.Local).AddTicks(4821));

            migrationBuilder.AlterColumn<string>(
                name: "BehaviorName",
                table: "Behaviors",
                type: "nvarchar(75)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(75)",
                oldMaxLength: 75,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(8158),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(3783));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(7906),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(3563));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(5455),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(1442));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(3067),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(4110));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(2767),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 371, DateTimeKind.Local).AddTicks(3869));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(3101),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(7988));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(2813),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 369, DateTimeKind.Local).AddTicks(7742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2594),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 366, DateTimeKind.Local).AddTicks(4));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2190),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 365, DateTimeKind.Local).AddTicks(9667));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6527),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(9214));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6226),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(8972));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(1013),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 7, 16, 18, 40, 4, 367, DateTimeKind.Local).AddTicks(9334));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(3125),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 367, DateTimeKind.Local).AddTicks(3012));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(2728),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 367, DateTimeKind.Local).AddTicks(2674));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(821),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(4562));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(461),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 16, 18, 40, 4, 370, DateTimeKind.Local).AddTicks(4261));
        }
    }
}
