using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TYR.WEB.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTypeIdVolunteerPersonActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VolunteerPersonActivities_AnimalTypes_AnimalTypeId",
                table: "VolunteerPersonActivities");

            migrationBuilder.DropIndex(
                name: "IX_VolunteerPersonActivities_AnimalTypeId",
                table: "VolunteerPersonActivities");

            migrationBuilder.DropColumn(
                name: "AnimalTypeId",
                table: "VolunteerPersonActivities");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Volunteers",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(2901),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(831));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateInactive",
                table: "Volunteers",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(7699),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(2478));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Volunteers",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(1782),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(378));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateActive",
                table: "Volunteers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(6314),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(2103));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerPersonActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 138, DateTimeKind.Local).AddTicks(1412),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(4461));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerPersonActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 138, DateTimeKind.Local).AddTicks(720),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(3991));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 122, DateTimeKind.Local).AddTicks(4989),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(8264));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 122, DateTimeKind.Local).AddTicks(4412),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(7720));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(6204),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(1459));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(5575),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(851));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 113, DateTimeKind.Local).AddTicks(5990),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 863, DateTimeKind.Local).AddTicks(5943));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 113, DateTimeKind.Local).AddTicks(5231),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 863, DateTimeKind.Local).AddTicks(5460));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 135, DateTimeKind.Local).AddTicks(2439),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(1566));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 135, DateTimeKind.Local).AddTicks(1572),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(1131));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(8505),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(2501));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(7673),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(2143));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(3635),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(475));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(2237),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(101));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 134, DateTimeKind.Local).AddTicks(1929),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(4861));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 134, DateTimeKind.Local).AddTicks(1397),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(4513));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 132, DateTimeKind.Local).AddTicks(5000),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(7980));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 132, DateTimeKind.Local).AddTicks(1386),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(7598));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(5499),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(5353));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(4849),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(4964));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(2491),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(2315));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(1942),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(1975));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 124, DateTimeKind.Local).AddTicks(9581),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(1104));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 124, DateTimeKind.Local).AddTicks(9049),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(571));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 123, DateTimeKind.Local).AddTicks(9483),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 869, DateTimeKind.Local).AddTicks(4385));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(5584),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(8944));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(6394),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(9403));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 136, DateTimeKind.Local).AddTicks(7381),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(8279));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 136, DateTimeKind.Local).AddTicks(6589),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(7928));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 130, DateTimeKind.Local).AddTicks(3935),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(9299));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 130, DateTimeKind.Local).AddTicks(3083),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(8844));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(9204),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(3725));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(8407),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(3310));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 114, DateTimeKind.Local).AddTicks(7574),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(3575));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 114, DateTimeKind.Local).AddTicks(6884),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(3145));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 136, DateTimeKind.Local).AddTicks(882),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(5101));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 135, DateTimeKind.Local).AddTicks(9622),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(4263));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(986),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(3138));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(217),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(2717));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 129, DateTimeKind.Local).AddTicks(4343),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(3293));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 129, DateTimeKind.Local).AddTicks(3837),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(2946));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 122, DateTimeKind.Local).AddTicks(7870),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 869, DateTimeKind.Local).AddTicks(302));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(1775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(6557));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(1093),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(6117));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 128, DateTimeKind.Local).AddTicks(8673),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(9533));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 128, DateTimeKind.Local).AddTicks(7937),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(9048));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 125, DateTimeKind.Local).AddTicks(7125),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(8702));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 125, DateTimeKind.Local).AddTicks(6608),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(8220));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 117, DateTimeKind.Local).AddTicks(8913),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 866, DateTimeKind.Local).AddTicks(2205));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 117, DateTimeKind.Local).AddTicks(8175),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 866, DateTimeKind.Local).AddTicks(1621));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 127, DateTimeKind.Local).AddTicks(8364),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(1970));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 127, DateTimeKind.Local).AddTicks(7674),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(1486));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1925, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(4750),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1925, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(236));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 120, DateTimeKind.Local).AddTicks(3318),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 867, DateTimeKind.Local).AddTicks(4379));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 120, DateTimeKind.Local).AddTicks(2495),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 867, DateTimeKind.Local).AddTicks(3813));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(7196),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(5426));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(6465),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(4980));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Volunteers",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(831),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(2901));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateInactive",
                table: "Volunteers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(2478),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(7699));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Volunteers",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(378),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(1782));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateActive",
                table: "Volunteers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(2103),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 137, DateTimeKind.Local).AddTicks(6314));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerPersonActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(4461),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 138, DateTimeKind.Local).AddTicks(1412));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerPersonActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 877, DateTimeKind.Local).AddTicks(3991),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 138, DateTimeKind.Local).AddTicks(720));

            migrationBuilder.AddColumn<int>(
                name: "AnimalTypeId",
                table: "VolunteerPersonActivities",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(8264),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 122, DateTimeKind.Local).AddTicks(4989));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(7720),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 122, DateTimeKind.Local).AddTicks(4412));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(1459),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(6204));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(851),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(5575));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 863, DateTimeKind.Local).AddTicks(5943),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 113, DateTimeKind.Local).AddTicks(5990));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 863, DateTimeKind.Local).AddTicks(5460),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 113, DateTimeKind.Local).AddTicks(5231));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(1566),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 135, DateTimeKind.Local).AddTicks(2439));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(1131),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 135, DateTimeKind.Local).AddTicks(1572));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(2501),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(8505));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(2143),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(7673));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(475),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(3635));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(101),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 133, DateTimeKind.Local).AddTicks(2237));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(4861),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 134, DateTimeKind.Local).AddTicks(1929));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 875, DateTimeKind.Local).AddTicks(4513),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 134, DateTimeKind.Local).AddTicks(1397));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(7980),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 132, DateTimeKind.Local).AddTicks(5000));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(7598),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 132, DateTimeKind.Local).AddTicks(1386));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(5353),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(5499));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(4964),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(4849));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(2315),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(2491));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(1975),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(1942));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(1104),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 124, DateTimeKind.Local).AddTicks(9581));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(571),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 124, DateTimeKind.Local).AddTicks(9049));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "PVDs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 869, DateTimeKind.Local).AddTicks(4385),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 123, DateTimeKind.Local).AddTicks(9483));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(8944),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(5584));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(9403),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(6394));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(8279),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 136, DateTimeKind.Local).AddTicks(7381));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OTPs",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(7928),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 136, DateTimeKind.Local).AddTicks(6589));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(9299),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 130, DateTimeKind.Local).AddTicks(3935));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(8844),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 130, DateTimeKind.Local).AddTicks(3083));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(3725),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(9204));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(3310),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(8407));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(3575),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 114, DateTimeKind.Local).AddTicks(7574));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(3145),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 114, DateTimeKind.Local).AddTicks(6884));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(5101),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 136, DateTimeKind.Local).AddTicks(882));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 876, DateTimeKind.Local).AddTicks(4263),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 135, DateTimeKind.Local).AddTicks(9622));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(3138),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(986));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 874, DateTimeKind.Local).AddTicks(2717),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 131, DateTimeKind.Local).AddTicks(217));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(3293),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 129, DateTimeKind.Local).AddTicks(4343));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 873, DateTimeKind.Local).AddTicks(2946),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 129, DateTimeKind.Local).AddTicks(3837));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 869, DateTimeKind.Local).AddTicks(302),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 122, DateTimeKind.Local).AddTicks(7870));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(6557),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(1775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 864, DateTimeKind.Local).AddTicks(6117),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 115, DateTimeKind.Local).AddTicks(1093));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(9533),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 128, DateTimeKind.Local).AddTicks(8673));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(9048),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 128, DateTimeKind.Local).AddTicks(7937));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(8702),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 125, DateTimeKind.Local).AddTicks(7125));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 870, DateTimeKind.Local).AddTicks(8220),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 125, DateTimeKind.Local).AddTicks(6608));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 866, DateTimeKind.Local).AddTicks(2205),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 117, DateTimeKind.Local).AddTicks(8913));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 866, DateTimeKind.Local).AddTicks(1621),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 117, DateTimeKind.Local).AddTicks(8175));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(1970),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 127, DateTimeKind.Local).AddTicks(8364));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 872, DateTimeKind.Local).AddTicks(1486),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 127, DateTimeKind.Local).AddTicks(7674));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1925, 2, 11, 13, 57, 35, 868, DateTimeKind.Local).AddTicks(236),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1925, 2, 18, 19, 48, 35, 121, DateTimeKind.Local).AddTicks(4750));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 867, DateTimeKind.Local).AddTicks(4379),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 120, DateTimeKind.Local).AddTicks(3318));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 867, DateTimeKind.Local).AddTicks(3813),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 120, DateTimeKind.Local).AddTicks(2495));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(5426),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(7196));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 2, 11, 13, 57, 35, 871, DateTimeKind.Local).AddTicks(4980),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 2, 18, 19, 48, 35, 126, DateTimeKind.Local).AddTicks(6465));

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerPersonActivities_AnimalTypeId",
                table: "VolunteerPersonActivities",
                column: "AnimalTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_VolunteerPersonActivities_AnimalTypes_AnimalTypeId",
                table: "VolunteerPersonActivities",
                column: "AnimalTypeId",
                principalTable: "AnimalTypes",
                principalColumn: "Id");
        }
    }
}
