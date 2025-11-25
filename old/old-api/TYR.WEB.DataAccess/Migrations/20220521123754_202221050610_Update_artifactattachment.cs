using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class _202221050610_Update_ArtifactAttachment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_Animals_AnimalId",
                table: "Attachments");

            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_PCOs_PcoId",
                table: "Attachments");

            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_Tenants_TenantId",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_AnimalId",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_PcoId",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_TenantId",
                table: "Attachments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 960, DateTimeKind.Local).AddTicks(3596),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(6255));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 960, DateTimeKind.Local).AddTicks(2974),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(5824));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 957, DateTimeKind.Local).AddTicks(376),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(6489));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 956, DateTimeKind.Local).AddTicks(9876),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(5922));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(4836),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8903));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(4356),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8402));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 953, DateTimeKind.Local).AddTicks(6177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 899, DateTimeKind.Local).AddTicks(8563));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 950, DateTimeKind.Local).AddTicks(4814),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 896, DateTimeKind.Local).AddTicks(5490));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "05/21/2022 18:07:53",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "05/18/2022 12:47:33");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(3682),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5168));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(4194),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5682));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(971),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2659));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(309),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2170));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(8350),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1841));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(7767),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1422));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 953, DateTimeKind.Local).AddTicks(8834),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1091));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 953, DateTimeKind.Local).AddTicks(7670),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(2590),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(4203));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(2107),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(3771));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 960, DateTimeKind.Local).AddTicks(6620),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(8744));

            migrationBuilder.AlterColumn<int>(
                name: "AnimalId",
                table: "Attachments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 957, DateTimeKind.Local).AddTicks(3812),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9568));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 957, DateTimeKind.Local).AddTicks(3244),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9055));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2122, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(3034),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2122, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(7247));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 958, DateTimeKind.Local).AddTicks(3020),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7995));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 958, DateTimeKind.Local).AddTicks(2519),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7408));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(6255),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 960, DateTimeKind.Local).AddTicks(3596));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(5824),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 960, DateTimeKind.Local).AddTicks(2974));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(6489),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 957, DateTimeKind.Local).AddTicks(376));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(5922),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 956, DateTimeKind.Local).AddTicks(9876));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8903),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(4836));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8402),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(4356));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 899, DateTimeKind.Local).AddTicks(8563),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 953, DateTimeKind.Local).AddTicks(6177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 896, DateTimeKind.Local).AddTicks(5490),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 950, DateTimeKind.Local).AddTicks(4814));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "05/18/2022 12:47:33",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "05/21/2022 18:07:53");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5168),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(3682));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5682),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(4194));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2659),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(971));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2170),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(309));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1841),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(8350));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1422),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(7767));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1091),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 953, DateTimeKind.Local).AddTicks(8834));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 953, DateTimeKind.Local).AddTicks(7670));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(4203),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(2590));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(3771),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 954, DateTimeKind.Local).AddTicks(2107));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(8744),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 960, DateTimeKind.Local).AddTicks(6620));

            migrationBuilder.AlterColumn<int>(
                name: "AnimalId",
                table: "Attachments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9568),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 957, DateTimeKind.Local).AddTicks(3812));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9055),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 957, DateTimeKind.Local).AddTicks(3244));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2122, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(7247),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2122, 5, 21, 18, 7, 53, 959, DateTimeKind.Local).AddTicks(3034));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7995),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 958, DateTimeKind.Local).AddTicks(3020));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 21, 18, 7, 53, 958, DateTimeKind.Local).AddTicks(2519));

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_AnimalId",
                table: "Attachments",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_PcoId",
                table: "Attachments",
                column: "PcoId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_TenantId",
                table: "Attachments",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_Animals_AnimalId",
                table: "Attachments",
                column: "AnimalId",
                principalTable: "Animals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_PCOs_PcoId",
                table: "Attachments",
                column: "PcoId",
                principalTable: "PCOs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_Tenants_TenantId",
                table: "Attachments",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
