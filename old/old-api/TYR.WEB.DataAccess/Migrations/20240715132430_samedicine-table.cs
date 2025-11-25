using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class SaMedicineTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8453),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(6654));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8075),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(5969));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9622),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 719, DateTimeKind.Local).AddTicks(7084));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9202),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 719, DateTimeKind.Local).AddTicks(6582));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2549),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(5847));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2153),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(5166));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 399, DateTimeKind.Local).AddTicks(9510),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 716, DateTimeKind.Local).AddTicks(5220));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 398, DateTimeKind.Local).AddTicks(9788),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 715, DateTimeKind.Local).AddTicks(4803));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(875),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(3402));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(532),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(3031));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8595),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(879));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8249),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(485));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5526),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(7275));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(6888));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2497),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(3811));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2150),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(3420));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(7066),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 727, DateTimeKind.Local).AddTicks(2335));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(6742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 727, DateTimeKind.Local).AddTicks(1423));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4184),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 718, DateTimeKind.Local).AddTicks(794));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4561),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 718, DateTimeKind.Local).AddTicks(1201));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(8204),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(4500));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(7816),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(3976));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2698),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 731, DateTimeKind.Local).AddTicks(3093));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2406),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 731, DateTimeKind.Local).AddTicks(2774));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(5063),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(355));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(4682),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(9693));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3996),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(146));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3107),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 716, DateTimeKind.Local).AddTicks(9192));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(1310),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(7906));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(928),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(7487));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(855));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9472),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(536));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6911),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(6766));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6640),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(6467));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(634),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(9853));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(8158),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 724, DateTimeKind.Local).AddTicks(8779));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(7906),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 724, DateTimeKind.Local).AddTicks(8493));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(5455),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 724, DateTimeKind.Local).AddTicks(5712));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(3067),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(2120));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(2767),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(1649));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(3101),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 726, DateTimeKind.Local).AddTicks(1225));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(2813),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 726, DateTimeKind.Local).AddTicks(421));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2594),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 720, DateTimeKind.Local).AddTicks(441));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2190),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 720, DateTimeKind.Local).AddTicks(8));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6527),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 729, DateTimeKind.Local).AddTicks(3869));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6226),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 729, DateTimeKind.Local).AddTicks(3384));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(1013),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(3371));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(3125),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 721, DateTimeKind.Local).AddTicks(2213));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(2728),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 721, DateTimeKind.Local).AddTicks(1798));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(821),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 728, DateTimeKind.Local).AddTicks(2445));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(461),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 728, DateTimeKind.Local).AddTicks(1442));

            migrationBuilder.CreateTable(
                name: "SAMedicines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicineName = table.Column<string>(type: "nvarchar(255)", nullable: true, defaultValue: ""),
                    UsedFor = table.Column<string>(type: "nvarchar(255)", nullable: true, defaultValue: ""),
                    Formulation = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValue: ""),
                    MonthlyMed = table.Column<bool>(type: "bit", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValue: ""),
                    DateEntered = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(2916)),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(3262)),
                    EnteredBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SAMedicines", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SAMedicines");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(6654),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8453));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(5969),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(8075));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 719, DateTimeKind.Local).AddTicks(7084),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9622));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 719, DateTimeKind.Local).AddTicks(6582),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 402, DateTimeKind.Local).AddTicks(9202));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(5847),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2549));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(5166),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(2153));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 716, DateTimeKind.Local).AddTicks(5220),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 399, DateTimeKind.Local).AddTicks(9510));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 715, DateTimeKind.Local).AddTicks(4803),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 398, DateTimeKind.Local).AddTicks(9788));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(3402),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(875));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(3031),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 412, DateTimeKind.Local).AddTicks(532));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(879),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8595));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 733, DateTimeKind.Local).AddTicks(485),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(8249));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(7275),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5526));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(6888),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(5177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(3811),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2497));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(3420),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 411, DateTimeKind.Local).AddTicks(2150));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 727, DateTimeKind.Local).AddTicks(2335),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(7066));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 727, DateTimeKind.Local).AddTicks(1423),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(6742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 718, DateTimeKind.Local).AddTicks(794),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4184));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 718, DateTimeKind.Local).AddTicks(1201),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(4561));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(4500),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(8204));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(3976),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(7816));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 731, DateTimeKind.Local).AddTicks(3093),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2698));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 731, DateTimeKind.Local).AddTicks(2774),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(2406));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(355),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(5063));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(9693),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(4682));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(146),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3996));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 716, DateTimeKind.Local).AddTicks(9192),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 400, DateTimeKind.Local).AddTicks(3107));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(7906),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(1310));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 717, DateTimeKind.Local).AddTicks(7487),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 401, DateTimeKind.Local).AddTicks(928));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(855),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 732, DateTimeKind.Local).AddTicks(536),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 410, DateTimeKind.Local).AddTicks(9472));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(6766),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6911));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(6467),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(6640));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 723, DateTimeKind.Local).AddTicks(9853),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(634));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 724, DateTimeKind.Local).AddTicks(8779),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(8158));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 724, DateTimeKind.Local).AddTicks(8493),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(7906));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 724, DateTimeKind.Local).AddTicks(5712),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 406, DateTimeKind.Local).AddTicks(5455));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(2120),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(3067));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 730, DateTimeKind.Local).AddTicks(1649),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 409, DateTimeKind.Local).AddTicks(2767));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 726, DateTimeKind.Local).AddTicks(1225),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(3101));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 726, DateTimeKind.Local).AddTicks(421),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 407, DateTimeKind.Local).AddTicks(2813));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 720, DateTimeKind.Local).AddTicks(441),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2594));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 720, DateTimeKind.Local).AddTicks(8),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 403, DateTimeKind.Local).AddTicks(2190));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 729, DateTimeKind.Local).AddTicks(3869),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6527));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 729, DateTimeKind.Local).AddTicks(3384),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(6226));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 7, 12, 18, 50, 46, 722, DateTimeKind.Local).AddTicks(3371),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 7, 15, 18, 54, 30, 405, DateTimeKind.Local).AddTicks(1013));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 721, DateTimeKind.Local).AddTicks(2213),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(3125));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 721, DateTimeKind.Local).AddTicks(1798),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 404, DateTimeKind.Local).AddTicks(2728));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 728, DateTimeKind.Local).AddTicks(2445),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(821));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 12, 18, 50, 46, 728, DateTimeKind.Local).AddTicks(1442),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 15, 18, 54, 30, 408, DateTimeKind.Local).AddTicks(461));
        }
    }
}
