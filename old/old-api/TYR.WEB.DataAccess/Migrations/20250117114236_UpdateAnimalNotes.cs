using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TYR.WEB.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAnimalNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Animals",
                newName: "Notes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(5963),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(4292));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(5348),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(3694));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(7312),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(8498));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(6700),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(8006));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 707, DateTimeKind.Local).AddTicks(3770),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 51, DateTimeKind.Local).AddTicks(4042));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 707, DateTimeKind.Local).AddTicks(3017),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 51, DateTimeKind.Local).AddTicks(3307));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(848),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(7564));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(192),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(7156));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(8274),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(9726));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(7592),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(9398));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(3735),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(7880));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(2806),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(7520));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 724, DateTimeKind.Local).AddTicks(2184),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(1897));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 724, DateTimeKind.Local).AddTicks(1497),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(1560));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(8621),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(5049));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(7930),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(4656));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(2439),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(2535));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(1456),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(2148));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(4297),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(740));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(3757),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 715, DateTimeKind.Local).AddTicks(9504),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(2740));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 715, DateTimeKind.Local).AddTicks(8953),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(2392));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 715, DateTimeKind.Local).AddTicks(3533),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(9330));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 709, DateTimeKind.Local).AddTicks(3284),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(8122));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 709, DateTimeKind.Local).AddTicks(4062),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(8582));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(8926),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 63, DateTimeKind.Local).AddTicks(2812));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(8405),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 63, DateTimeKind.Local).AddTicks(2450));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(2789),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(6392));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(2126),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(5957));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(196),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(376));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(9568),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(9987));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(5156),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(2029));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(4492),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(1592));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(5089),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 63, DateTimeKind.Local).AddTicks(363));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(4335),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(9898));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(8638),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(221));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(8011),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(9838));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 720, DateTimeKind.Local).AddTicks(4051),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(594));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 720, DateTimeKind.Local).AddTicks(3511),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(260));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(8115),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(5780));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(9601),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(5651));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(8956),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(5226));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 719, DateTimeKind.Local).AddTicks(8701),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 59, DateTimeKind.Local).AddTicks(6982));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 719, DateTimeKind.Local).AddTicks(7944),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 59, DateTimeKind.Local).AddTicks(6524));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 716, DateTimeKind.Local).AddTicks(7806),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(7309));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 716, DateTimeKind.Local).AddTicks(7259),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(6987));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 711, DateTimeKind.Local).AddTicks(2307),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 54, DateTimeKind.Local).AddTicks(1891));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 711, DateTimeKind.Local).AddTicks(1580),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 54, DateTimeKind.Local).AddTicks(1414));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 718, DateTimeKind.Local).AddTicks(8174),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 59, DateTimeKind.Local).AddTicks(20));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 718, DateTimeKind.Local).AddTicks(7471),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(9554));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1925, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(5996),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1925, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(7476));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 712, DateTimeKind.Local).AddTicks(8648),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(2620));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 712, DateTimeKind.Local).AddTicks(7955),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(2140));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(8836),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(3751));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(8161),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(3304));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "Animals",
                newName: "Description");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(4292),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(5963));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(3694),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(5348));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(8498),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(7312));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(8006),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(6700));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 51, DateTimeKind.Local).AddTicks(4042),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 707, DateTimeKind.Local).AddTicks(3770));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 51, DateTimeKind.Local).AddTicks(3307),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 707, DateTimeKind.Local).AddTicks(3017));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(7564),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(848));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(7156),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(192));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(9726),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(8274));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(9398),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(7592));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(7880),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(3735));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(7520),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 723, DateTimeKind.Local).AddTicks(2806));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(1897),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 724, DateTimeKind.Local).AddTicks(2184));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(1560),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 724, DateTimeKind.Local).AddTicks(1497));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(5049),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(8621));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(4656),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(7930));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(2535),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(2439));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(2148),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 722, DateTimeKind.Local).AddTicks(1456));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(740),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(4297));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(3757));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(2740),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 715, DateTimeKind.Local).AddTicks(9504));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(2392),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 715, DateTimeKind.Local).AddTicks(8953));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(9330),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 715, DateTimeKind.Local).AddTicks(3533));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(8122),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 709, DateTimeKind.Local).AddTicks(3284));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(8582),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 709, DateTimeKind.Local).AddTicks(4062));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 63, DateTimeKind.Local).AddTicks(2812),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(8926));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 63, DateTimeKind.Local).AddTicks(2450),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(8405));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(6392),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(2789));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(5957),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(2126));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(376),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(196));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(9987),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(9568));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(2029),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(5156));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(1592),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(4492));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 63, DateTimeKind.Local).AddTicks(363),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(5089));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 62, DateTimeKind.Local).AddTicks(9898),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 725, DateTimeKind.Local).AddTicks(4335));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 61, DateTimeKind.Local).AddTicks(221),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(8638));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(9838),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 721, DateTimeKind.Local).AddTicks(8011));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(594),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 720, DateTimeKind.Local).AddTicks(4051));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 60, DateTimeKind.Local).AddTicks(260),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 720, DateTimeKind.Local).AddTicks(3511));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 56, DateTimeKind.Local).AddTicks(5780),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 714, DateTimeKind.Local).AddTicks(8115));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(5651),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(9601));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 52, DateTimeKind.Local).AddTicks(5226),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 708, DateTimeKind.Local).AddTicks(8956));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 59, DateTimeKind.Local).AddTicks(6982),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 719, DateTimeKind.Local).AddTicks(8701));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 59, DateTimeKind.Local).AddTicks(6524),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 719, DateTimeKind.Local).AddTicks(7944));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(7309),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 716, DateTimeKind.Local).AddTicks(7806));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 57, DateTimeKind.Local).AddTicks(6987),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 716, DateTimeKind.Local).AddTicks(7259));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 54, DateTimeKind.Local).AddTicks(1891),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 711, DateTimeKind.Local).AddTicks(2307));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 54, DateTimeKind.Local).AddTicks(1414),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 711, DateTimeKind.Local).AddTicks(1580));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 59, DateTimeKind.Local).AddTicks(20),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 718, DateTimeKind.Local).AddTicks(8174));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(9554),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 718, DateTimeKind.Local).AddTicks(7471));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1925, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(7476),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1925, 1, 17, 17, 12, 33, 713, DateTimeKind.Local).AddTicks(5996));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(2620),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 712, DateTimeKind.Local).AddTicks(8648));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 55, DateTimeKind.Local).AddTicks(2140),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 712, DateTimeKind.Local).AddTicks(7955));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(3751),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(8836));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 1, 10, 18, 36, 0, 58, DateTimeKind.Local).AddTicks(3304),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 1, 17, 17, 12, 33, 717, DateTimeKind.Local).AddTicks(8161));
        }
    }
}
