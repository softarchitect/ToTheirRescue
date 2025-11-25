using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class UpdateAnimalProcedureTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TagNumber",
                table: "AnimalProcedures");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(8719),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(4068));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(8355),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(3773));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 865, DateTimeKind.Local).AddTicks(5556),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(6301));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 865, DateTimeKind.Local).AddTicks(4363),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(5950));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(2496),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 20, DateTimeKind.Local).AddTicks(9036));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(2010),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 20, DateTimeKind.Local).AddTicks(8578));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(4365),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(210));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 854, DateTimeKind.Local).AddTicks(7425),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 13, DateTimeKind.Local).AddTicks(7033));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(7776),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(673));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(7395),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(407));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "04/18/2024 13:58:36",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "04/15/2024 17:33:36");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 862, DateTimeKind.Local).AddTicks(451),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(5140));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 862, DateTimeKind.Local).AddTicks(880),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(5535));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(8267),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(3332));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(7785),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(3017));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(5200),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(1198));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(4779),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(890));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(6782),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(1969));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(5909),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(1262));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(9593),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(4412));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(9229),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(4047));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(1024),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(6021));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(7786),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(2104));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(7470),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(1543));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(4183),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(8693));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 872, DateTimeKind.Local).AddTicks(3423),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 24, DateTimeKind.Local).AddTicks(4295));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 872, DateTimeKind.Local).AddTicks(3132),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 24, DateTimeKind.Local).AddTicks(4012));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(3199),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(6822));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(2896),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(6572));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 866, DateTimeKind.Local).AddTicks(80),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(9251));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 865, DateTimeKind.Local).AddTicks(9477),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(8678));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(7409),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(9311));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(7108),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(9072));

            migrationBuilder.AddColumn<int>(
                name: "HospitalClinicId",
                table: "AnimalProcedures",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(927),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 4, 15, 17, 33, 36, 20, DateTimeKind.Local).AddTicks(7727));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 867, DateTimeKind.Local).AddTicks(2653),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 19, DateTimeKind.Local).AddTicks(9707));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 867, DateTimeKind.Local).AddTicks(2246),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 19, DateTimeKind.Local).AddTicks(9312));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(1480),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(4273));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(1132),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(3980));

            migrationBuilder.CreateIndex(
                name: "IX_AnimalProcedures_HospitalClinicId",
                table: "AnimalProcedures",
                column: "HospitalClinicId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimalProcedures_HospitalClinics_HospitalClinicId",
                table: "AnimalProcedures",
                column: "HospitalClinicId",
                principalTable: "HospitalClinics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimalProcedures_HospitalClinics_HospitalClinicId",
                table: "AnimalProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AnimalProcedures_HospitalClinicId",
                table: "AnimalProcedures");

            migrationBuilder.DropColumn(
                name: "HospitalClinicId",
                table: "AnimalProcedures");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(4068),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(8719));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(3773),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(8355));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(6301),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 865, DateTimeKind.Local).AddTicks(5556));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(5950),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 865, DateTimeKind.Local).AddTicks(4363));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 20, DateTimeKind.Local).AddTicks(9036),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(2496));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 20, DateTimeKind.Local).AddTicks(8578),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(2010));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(210),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(4365));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 13, DateTimeKind.Local).AddTicks(7033),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 854, DateTimeKind.Local).AddTicks(7425));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(673),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(7776));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(407),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(7395));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "04/15/2024 17:33:36",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "04/18/2024 13:58:36");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(5140),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 862, DateTimeKind.Local).AddTicks(451));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(5535),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 862, DateTimeKind.Local).AddTicks(880));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(3332),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(8267));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(3017),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(7785));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(1198),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(5200));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(890),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(4779));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(1969),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(6782));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(1262),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(5909));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(4412),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(9593));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 16, DateTimeKind.Local).AddTicks(4047),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 861, DateTimeKind.Local).AddTicks(9229));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(6021),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(1024));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(2104),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(7786));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(1543),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(7470));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 21, DateTimeKind.Local).AddTicks(8693),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 869, DateTimeKind.Local).AddTicks(4183));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 24, DateTimeKind.Local).AddTicks(4295),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 872, DateTimeKind.Local).AddTicks(3423));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 24, DateTimeKind.Local).AddTicks(4012),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 872, DateTimeKind.Local).AddTicks(3132));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(6822),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(3199));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 22, DateTimeKind.Local).AddTicks(6572),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 870, DateTimeKind.Local).AddTicks(2896));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(9251),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 866, DateTimeKind.Local).AddTicks(80));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 18, DateTimeKind.Local).AddTicks(8678),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 865, DateTimeKind.Local).AddTicks(9477));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(9311),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(7409));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(9072),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(7108));

            migrationBuilder.AddColumn<string>(
                name: "TagNumber",
                table: "AnimalProcedures",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 4, 15, 17, 33, 36, 20, DateTimeKind.Local).AddTicks(7727),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 4, 18, 13, 58, 36, 868, DateTimeKind.Local).AddTicks(927));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 19, DateTimeKind.Local).AddTicks(9707),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 867, DateTimeKind.Local).AddTicks(2653));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 19, DateTimeKind.Local).AddTicks(9312),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 867, DateTimeKind.Local).AddTicks(2246));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(4273),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(1480));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 15, 17, 33, 36, 23, DateTimeKind.Local).AddTicks(3980),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 18, 13, 58, 36, 871, DateTimeKind.Local).AddTicks(1132));
        }
    }
}
