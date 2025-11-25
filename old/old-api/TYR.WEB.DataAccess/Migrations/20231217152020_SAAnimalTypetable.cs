using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class SAAnimalTypeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(9392),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4326));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(9061),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4118));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(6218),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(379));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(5693),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(176));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(3776),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(1142));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(3448),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(822));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(6334),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(6689));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 250, DateTimeKind.Local).AddTicks(8603),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 905, DateTimeKind.Local).AddTicks(768));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "12/17/2023 20:50:20",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "12/07/2023 11:04:57");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(1501),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9687));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(1895),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9881));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(9550),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8643));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(9213),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8453));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(6193),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2562));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(5858),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2370));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(8400),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7934));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(7559),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(696),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9275));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(273),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9041));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(1173),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(5382));

            migrationBuilder.AlterColumn<int>(
                name: "PcoId",
                table: "Attachments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(7216),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(9070));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(6973),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(8917));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(4016),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(7085));

            migrationBuilder.AlterColumn<string>(
                name: "TypeName",
                table: "AnimalTypes",
                type: "nvarchar(25)",
                maxLength: 25,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(25)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "AnimalTypes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "AnimalTypes",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "AnimalTypes",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 267, DateTimeKind.Local).AddTicks(1670),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 267, DateTimeKind.Local).AddTicks(2012));

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "AnimalTypes",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "");

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
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(8503),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1818));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(8156),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1616));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2123, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(2609),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2123, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(221));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 264, DateTimeKind.Local).AddTicks(5662),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(6070));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 264, DateTimeKind.Local).AddTicks(5310),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(5867));

            migrationBuilder.CreateTable(
                name: "SAAnimalTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeNameSingular = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false, defaultValue: ""),
                    TypeNamePlural = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false, defaultValue: ""),
                    DateEntered = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 267, DateTimeKind.Local).AddTicks(5670)),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 267, DateTimeKind.Local).AddTicks(5961)),
                    EnteredBy = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true, defaultValue: ""),
                    ModifiedBy = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true, defaultValue: ""),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SAAnimalTypes", x => x.Id);
                });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimalTypes_SAAnimalTypes_SAAnimalTypeId",
                table: "AnimalTypes");

            migrationBuilder.DropTable(
                name: "SAAnimalTypes");

            migrationBuilder.DropIndex(
                name: "IX_AnimalTypes_SAAnimalTypeId",
                table: "AnimalTypes");

            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "AnimalTypes");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "AnimalTypes");

            migrationBuilder.DropColumn(
                name: "SAAnimalTypeId",
                table: "AnimalTypes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4326),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(9392));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4118),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(9061));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(379),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(6218));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(176),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(5693));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(1142),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(3776));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(822),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(3448));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(6689),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(6334));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 905, DateTimeKind.Local).AddTicks(768),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 250, DateTimeKind.Local).AddTicks(8603));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "12/07/2023 11:04:57",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "12/17/2023 20:50:20");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9687),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(1501));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9881),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(1895));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8643),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(9550));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8453),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(9213));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2562),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(6193));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2370),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(5858));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7934),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(8400));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 259, DateTimeKind.Local).AddTicks(7559));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9275),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(696));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9041),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 260, DateTimeKind.Local).AddTicks(273));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(5382),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(1173));

            migrationBuilder.AlterColumn<int>(
                name: "PcoId",
                table: "Attachments",
                type: "int",
                nullable: true,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(9070),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(7216));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(8917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(6973));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(7085),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 266, DateTimeKind.Local).AddTicks(4016));

            migrationBuilder.AlterColumn<string>(
                name: "TypeName",
                table: "AnimalTypes",
                type: "nvarchar(25)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(25)",
                oldMaxLength: 25,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "AnimalTypes",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "AnimalTypes",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "AnimalTypes",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 267, DateTimeKind.Local).AddTicks(1670));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1818),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(8503));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1616),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 263, DateTimeKind.Local).AddTicks(8156));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2123, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(221),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2123, 12, 17, 20, 50, 20, 265, DateTimeKind.Local).AddTicks(2609));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(6070),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 264, DateTimeKind.Local).AddTicks(5662));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(5867),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 17, 20, 50, 20, 264, DateTimeKind.Local).AddTicks(5310));
        }
    }
}
