using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class UpdateAnimalMilestone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OtherRescue",
                table: "AnimalMilestones");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(7702),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(1416));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(6925),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(866));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(1539),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6606));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(965),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6121));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 54, DateTimeKind.Local).AddTicks(7201),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(7145));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 54, DateTimeKind.Local).AddTicks(6808),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(5940));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(3997),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(4903));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 43, DateTimeKind.Local).AddTicks(422),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 250, DateTimeKind.Local).AddTicks(5585));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 22:09:34",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 22:09:34",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(2887),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(4946));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(3576),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(5612));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(9779),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(1008));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(9205),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(215));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(1693),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(3975));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(1137),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(2917));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(7539),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(8675));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(6143),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(7220));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(1679),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(3328));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(1109),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(2600));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 56, DateTimeKind.Local).AddTicks(1084),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(4908));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 22:09:34",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 22:09:34",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(5837),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9593));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(5237),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9131));

            migrationBuilder.AlterColumn<int>(
                name: "PcoId",
                table: "AnimalMilestones",
                type: "int",
                nullable: true,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "AnimalMilestones",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2122, 3, 12, 22, 9, 34, 54, DateTimeKind.Local).AddTicks(5454),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 53, DateTimeKind.Local).AddTicks(5909),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(1128));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 53, DateTimeKind.Local).AddTicks(5434),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(95));

            migrationBuilder.AlterColumn<string>(
                name: "AcquisitionWayName",
                table: "AnimalMilestones",
                type: "nvarchar(75)",
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(75)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AcquisitionWayId",
                table: "AnimalMilestones",
                type: "int",
                nullable: true,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OtherRescueShelterId",
                table: "AnimalMilestones",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimalMilestones_OtherRescueShelterId",
                table: "AnimalMilestones",
                column: "OtherRescueShelterId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimalMilestones_OtherRescueShelters_OtherRescueShelterId",
                table: "AnimalMilestones",
                column: "OtherRescueShelterId",
                principalTable: "OtherRescueShelters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimalMilestones_OtherRescueShelters_OtherRescueShelterId",
                table: "AnimalMilestones");

            migrationBuilder.DropIndex(
                name: "IX_AnimalMilestones_OtherRescueShelterId",
                table: "AnimalMilestones");

            migrationBuilder.DropColumn(
                name: "OtherRescueShelterId",
                table: "AnimalMilestones");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(1416),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(7702));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(866),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(6925));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6606),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(1539));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6121),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(965));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(7145),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 54, DateTimeKind.Local).AddTicks(7201));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(5940),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 54, DateTimeKind.Local).AddTicks(6808));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(4903),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(3997));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 250, DateTimeKind.Local).AddTicks(5585),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 43, DateTimeKind.Local).AddTicks(422));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 22:09:34");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 22:09:34");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(4946),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(2887));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(5612),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(3576));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(1008),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(9779));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(215),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(9205));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(3975),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(1693));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(2917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 55, DateTimeKind.Local).AddTicks(1137));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(8675),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(7539));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(7220),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 48, DateTimeKind.Local).AddTicks(6143));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(3328),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(1679));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(2600),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 49, DateTimeKind.Local).AddTicks(1109));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(4908),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 56, DateTimeKind.Local).AddTicks(1084));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 22:09:34");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 22:09:34");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9593),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(5837));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9131),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 52, DateTimeKind.Local).AddTicks(5237));

            migrationBuilder.AlterColumn<int>(
                name: "PcoId",
                table: "AnimalMilestones",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "AnimalMilestones",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2122, 3, 12, 22, 9, 34, 54, DateTimeKind.Local).AddTicks(5454));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(1128),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 53, DateTimeKind.Local).AddTicks(5909));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(95),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 22, 9, 34, 53, DateTimeKind.Local).AddTicks(5434));

            migrationBuilder.AlterColumn<string>(
                name: "AcquisitionWayName",
                table: "AnimalMilestones",
                type: "nvarchar(75)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(75)",
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "AcquisitionWayId",
                table: "AnimalMilestones",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OtherRescue",
                table: "AnimalMilestones",
                type: "nvarchar(255)",
                nullable: true,
                defaultValue: "");
        }
    }
}
