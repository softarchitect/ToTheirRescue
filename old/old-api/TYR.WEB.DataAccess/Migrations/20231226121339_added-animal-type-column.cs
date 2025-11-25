using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class AddedAnimalTypeColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimalTypes_SAAnimalTypes_SAAnimalTypeId",
                table: "AnimalTypes");

            migrationBuilder.DropIndex(
                name: "IX_AnimalTypes_SAAnimalTypeId",
                table: "AnimalTypes");

            migrationBuilder.DropColumn(
                name: "SAAnimalTypeId",
                table: "AnimalTypes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(8076),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(1405));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(7747),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(1034));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(2273),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 166, DateTimeKind.Local).AddTicks(9417));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(1834),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 166, DateTimeKind.Local).AddTicks(9041));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(2589),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(6066));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(2249),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(5757));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(1883),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(7102));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 351, DateTimeKind.Local).AddTicks(1022),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 154, DateTimeKind.Local).AddTicks(7852));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(4265),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(7273));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(3984),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(7008));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "12/26/2023 17:43:39",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "12/18/2023 19:16:28");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(6455),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(1910));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(6847),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(2338));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(4712),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(206));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(4379),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(9896));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(4897),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(8346));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(4569),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(8047));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(3485),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(9094));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(2753),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(8291));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(5775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(1255));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(5447),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(894));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(9860),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(3130));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 358, DateTimeKind.Local).AddTicks(5746),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(8927));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 358, DateTimeKind.Local).AddTicks(5511),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(8707));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 358, DateTimeKind.Local).AddTicks(2605),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(5918));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(387),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(3536));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(57),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(3286));

            migrationBuilder.AddColumn<string>(
                name: "RoleName",
                table: "AnimalTypes",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(4519),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(1671));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(4166),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(1349));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2123, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(1322),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2123, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(4942));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 356, DateTimeKind.Local).AddTicks(3917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(8364));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 356, DateTimeKind.Local).AddTicks(3564),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(8033));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoleName",
                table: "AnimalTypes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(1405),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(8076));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(1034),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(7747));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 166, DateTimeKind.Local).AddTicks(9417),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(2273));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 166, DateTimeKind.Local).AddTicks(9041),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(1834));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(6066),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(2589));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(5757),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(2249));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(7102),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(1883));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 154, DateTimeKind.Local).AddTicks(7852),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 351, DateTimeKind.Local).AddTicks(1022));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(7273),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(4265));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(7008),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(3984));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "12/18/2023 19:16:28",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "12/26/2023 17:43:39");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(1910),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(6455));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(2338),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(6847));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(206),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(4712));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(9896),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(4379));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(8346),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(4897));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(8047),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(4569));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(9094),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(3485));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 163, DateTimeKind.Local).AddTicks(8291),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(2753));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(1255),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(5775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 164, DateTimeKind.Local).AddTicks(894),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 353, DateTimeKind.Local).AddTicks(5447));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(3130),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(9860));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(8927),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 358, DateTimeKind.Local).AddTicks(5746));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(8707),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 358, DateTimeKind.Local).AddTicks(5511));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 169, DateTimeKind.Local).AddTicks(5918),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 358, DateTimeKind.Local).AddTicks(2605));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(3536),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(387));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 170, DateTimeKind.Local).AddTicks(3286),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 359, DateTimeKind.Local).AddTicks(57));

            migrationBuilder.AddColumn<int>(
                name: "SAAnimalTypeId",
                table: "AnimalTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(1671),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(4519));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(1349),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 355, DateTimeKind.Local).AddTicks(4166));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2123, 12, 18, 19, 16, 28, 168, DateTimeKind.Local).AddTicks(4942),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2123, 12, 26, 17, 43, 39, 357, DateTimeKind.Local).AddTicks(1322));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(8364),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 356, DateTimeKind.Local).AddTicks(3917));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 18, 19, 16, 28, 167, DateTimeKind.Local).AddTicks(8033),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 26, 17, 43, 39, 356, DateTimeKind.Local).AddTicks(3564));

            migrationBuilder.CreateIndex(
                name: "IX_AnimalTypes_SAAnimalTypeId",
                table: "AnimalTypes",
                column: "SAAnimalTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimalTypes_SAAnimalTypes_SAAnimalTypeId",
                table: "AnimalTypes",
                column: "SAAnimalTypeId",
                principalTable: "SAAnimalTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
