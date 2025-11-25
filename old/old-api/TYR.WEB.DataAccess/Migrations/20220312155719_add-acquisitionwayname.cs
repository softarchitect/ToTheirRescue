using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class AddAcquisitionWayName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(1416),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(6873));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(866),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(6461));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6606),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(5782));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6121),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(5388));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(7145),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 43, DateTimeKind.Local).AddTicks(9516));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(5940),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 43, DateTimeKind.Local).AddTicks(9095));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(4903),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(4576));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 250, DateTimeKind.Local).AddTicks(5585),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 33, DateTimeKind.Local).AddTicks(8572));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(4946),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(2042));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(5612),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(2440));

            migrationBuilder.AlterColumn<int>(
                name: "CountryId",
                table: "PCOs",
                type: "int",
                nullable: true,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(1008),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(9920));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(215),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(9399));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(3975),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(2444));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(2917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(2049));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(8675),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(8408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(7220),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(6930));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(3328),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(1111));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(2600),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(720));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(4908),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(9249));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Animals",
                type: "nvarchar(50)",
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "03/12/2022 21:27:19",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9593),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(8774));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9131),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(8358));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(1128),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 42, DateTimeKind.Local).AddTicks(4905));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(95),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 42, DateTimeKind.Local).AddTicks(4419));

            migrationBuilder.AddColumn<string>(
                name: "AcquisitionWayName",
                table: "AnimalMilestones",
                type: "nvarchar(75)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcquisitionWayName",
                table: "AnimalMilestones");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(6873),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(1416));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(6461),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(866));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(5782),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6606));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(5388),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(6121));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 43, DateTimeKind.Local).AddTicks(9516),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(7145));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 43, DateTimeKind.Local).AddTicks(9095),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 264, DateTimeKind.Local).AddTicks(5940));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(4576),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(4903));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 33, DateTimeKind.Local).AddTicks(8572),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 250, DateTimeKind.Local).AddTicks(5585));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(2042),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(4946));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(2440),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(5612));

            migrationBuilder.AlterColumn<int>(
                name: "CountryId",
                table: "PCOs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(9920),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(1008));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(9399),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(215));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(2444),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(3975));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(2049),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 265, DateTimeKind.Local).AddTicks(2917));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(8408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(8675));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 39, DateTimeKind.Local).AddTicks(6930),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 257, DateTimeKind.Local).AddTicks(7220));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(1111),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(3328));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 40, DateTimeKind.Local).AddTicks(720),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 258, DateTimeKind.Local).AddTicks(2600));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 44, DateTimeKind.Local).AddTicks(9249),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 266, DateTimeKind.Local).AddTicks(4908));

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Animals",
                type: "nvarchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Animals",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "03/12/2022 21:27:19");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(8774),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9593));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 41, DateTimeKind.Local).AddTicks(8358),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 261, DateTimeKind.Local).AddTicks(9131));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 42, DateTimeKind.Local).AddTicks(4905),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(1128));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 26, 17, 4, 29, 42, DateTimeKind.Local).AddTicks(4419),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 3, 12, 21, 27, 19, 263, DateTimeKind.Local).AddTicks(95));
        }
    }
}
