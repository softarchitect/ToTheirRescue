using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TYR.WEB.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class OtpRemoveTenantId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "OTPs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(7058),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(8443));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(6675),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(7915));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(9716),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(1823));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(8748),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(1348));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 661, DateTimeKind.Local).AddTicks(8952),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 238, DateTimeKind.Local).AddTicks(3330));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 661, DateTimeKind.Local).AddTicks(8244),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 238, DateTimeKind.Local).AddTicks(2701));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(3803),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(6000));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(3384),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(5435));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(5616),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(3901));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(5290),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(2501));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(3621),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(395));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(3242),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(9951));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(7958),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(9244));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(7617),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(8714));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(1015),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(7429));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(625),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(6970));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(8201),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(4492));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(7823),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(4045));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(3871),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(7537));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(3554),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(7151));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 672, DateTimeKind.Local).AddTicks(5630),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(8192));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 672, DateTimeKind.Local).AddTicks(5258),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(7780));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 672, DateTimeKind.Local).AddTicks(2088),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(4169));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(9138),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(7870));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(9947),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(8483));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(9681),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 252, DateTimeKind.Local).AddTicks(2297));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(9238),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 252, DateTimeKind.Local).AddTicks(1876));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(1899),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(7598));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(1479),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(7008));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(3039),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(4015));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(2496),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(3576));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(705),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(1750));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 662, DateTimeKind.Local).AddTicks(9872),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(1257));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(7007),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(9382));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(6521),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(8797));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(6079),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(2008));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(5580),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(1550));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(5685),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(979));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(5334),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(598));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(8463),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(4));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(5267),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(5062));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(4603),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(4563));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(2042),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 247, DateTimeKind.Local).AddTicks(6911));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(1542),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 247, DateTimeKind.Local).AddTicks(6389));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(371),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(3653));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(48),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(3198));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 665, DateTimeKind.Local).AddTicks(9138),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 241, DateTimeKind.Local).AddTicks(2013));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 665, DateTimeKind.Local).AddTicks(8338),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 241, DateTimeKind.Local).AddTicks(1499));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 674, DateTimeKind.Local).AddTicks(4215),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(8667));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 674, DateTimeKind.Local).AddTicks(3727),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(8134));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(7610),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(1360),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 242, DateTimeKind.Local).AddTicks(5045));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(802),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 242, DateTimeKind.Local).AddTicks(4511));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(7060),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(914));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(6608),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(414));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(8443),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(7058));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(7915),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(6675));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(1823),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(9716));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(1348),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(8748));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 238, DateTimeKind.Local).AddTicks(3330),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 661, DateTimeKind.Local).AddTicks(8952));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 238, DateTimeKind.Local).AddTicks(2701),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 661, DateTimeKind.Local).AddTicks(8244));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(6000),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(3803));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(5435),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(3384));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(3901),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(5616));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(2501),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(5290));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(395),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(3621));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(9951),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(3242));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(9244),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(7958));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 250, DateTimeKind.Local).AddTicks(8714),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(7617));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(7429),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(1015));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(6970),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 677, DateTimeKind.Local).AddTicks(625));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(4492),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(8201));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(4045),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(7823));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(7537),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(3871));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(7151),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(3554));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(8192),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 672, DateTimeKind.Local).AddTicks(5630));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(7780),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 672, DateTimeKind.Local).AddTicks(5258));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(4169),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 672, DateTimeKind.Local).AddTicks(2088));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(7870),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(9138));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(8483),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(9947));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 252, DateTimeKind.Local).AddTicks(2297),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(9681));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 252, DateTimeKind.Local).AddTicks(1876),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(9238));

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "OTPs",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(7598),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(1899));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(7008),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(1479));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(4015),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(3039));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(3576),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(2496));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(1750),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(705));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(1257),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 662, DateTimeKind.Local).AddTicks(9872));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(9382),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(7007));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 251, DateTimeKind.Local).AddTicks(8797),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 678, DateTimeKind.Local).AddTicks(6521));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(2008),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(6079));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 249, DateTimeKind.Local).AddTicks(1550),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 676, DateTimeKind.Local).AddTicks(5580));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(979),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(5685));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 248, DateTimeKind.Local).AddTicks(598),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(5334));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 244, DateTimeKind.Local).AddTicks(4),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 671, DateTimeKind.Local).AddTicks(8463));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(5062),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(5267));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 239, DateTimeKind.Local).AddTicks(4563),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 663, DateTimeKind.Local).AddTicks(4603));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 247, DateTimeKind.Local).AddTicks(6911),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(2042));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 247, DateTimeKind.Local).AddTicks(6389),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 675, DateTimeKind.Local).AddTicks(1542));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(3653),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(371));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 245, DateTimeKind.Local).AddTicks(3198),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(48));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 241, DateTimeKind.Local).AddTicks(2013),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 665, DateTimeKind.Local).AddTicks(9138));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 241, DateTimeKind.Local).AddTicks(1499),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 665, DateTimeKind.Local).AddTicks(8338));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(8667),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 674, DateTimeKind.Local).AddTicks(4215));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(8134),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 674, DateTimeKind.Local).AddTicks(3727));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 11, 25, 2, 24, 42, 243, DateTimeKind.Local).AddTicks(742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(7610));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 242, DateTimeKind.Local).AddTicks(5045),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(1360));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 242, DateTimeKind.Local).AddTicks(4511),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 670, DateTimeKind.Local).AddTicks(802));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(914),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(7060));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 25, 2, 24, 42, 246, DateTimeKind.Local).AddTicks(414),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 28, 20, 3, 9, 673, DateTimeKind.Local).AddTicks(6608));
        }
    }
}
