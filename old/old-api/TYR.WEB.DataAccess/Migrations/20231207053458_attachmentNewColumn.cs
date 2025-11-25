using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class AttachmentNewColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Attachments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4326),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(3216));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4118),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(3020));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(379),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 319, DateTimeKind.Local).AddTicks(8582));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(176),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 319, DateTimeKind.Local).AddTicks(8358));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(1142),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(9949));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(822),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(9744));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(6689),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(2755));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 905, DateTimeKind.Local).AddTicks(768),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 316, DateTimeKind.Local).AddTicks(7151));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "12/07/2023 11:04:57",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "11/27/2023 17:51:24");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9687),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(5956));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9881),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(6153));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8643),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(4866));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8453),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(4646));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2562),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(1352));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2370),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(1123));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7934),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(4149));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(3580));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9275),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(5484));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9041),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(5288));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(5382),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(4460));

            migrationBuilder.AlterColumn<string>(
                name: "ThumbnailBlobUrl",
                table: "Attachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Attachments",
                type: "int",
                nullable: true,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SequenceNo",
                table: "Attachments",
                type: "int",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "PublicityRank",
                table: "Attachments",
                type: "int",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "PcoId",
                table: "Attachments",
                type: "int",
                nullable: true,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OriginalBlobUrl",
                table: "Attachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Attachments",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Attachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Attachments",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "FileNameExtension",
                table: "Attachments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "Attachments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Entity",
                table: "Attachments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Attachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(9070),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(8917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BlobUrl",
                table: "Attachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AttachmentType",
                table: "Attachments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(7085),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AnimalId",
                table: "Attachments",
                type: "int",
                nullable: true,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Animal",
                table: "Attachments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Attachments",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Person",
                table: "Attachments",
                type: "nvarchar(360)",
                maxLength: 360,
                nullable: true,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1818),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(102));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1616),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 319, DateTimeKind.Local).AddTicks(9890));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2123, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(221),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2123, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(9119));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(6070),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(4677));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(5867),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(4460));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Animal",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "Person",
                table: "Attachments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(3216),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4326));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(3020),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(4118));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 319, DateTimeKind.Local).AddTicks(8582),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(379));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 319, DateTimeKind.Local).AddTicks(8358),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(176));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(9949),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(1142));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(9744),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(822));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(2755),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(6689));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 316, DateTimeKind.Local).AddTicks(7151),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 905, DateTimeKind.Local).AddTicks(768));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "11/27/2023 17:51:24",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "12/07/2023 11:04:57");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(5956),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9687));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(6153),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9881));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(4866),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8643));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(4646),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(8453));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(1352),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2562));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(1123),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(2370));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(4149),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7934));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(3580),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(7408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(5484),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9275));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 318, DateTimeKind.Local).AddTicks(5288),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 906, DateTimeKind.Local).AddTicks(9041));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 321, DateTimeKind.Local).AddTicks(4460),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(5382));

            migrationBuilder.AlterColumn<string>(
                name: "ThumbnailBlobUrl",
                table: "Attachments",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Attachments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "SequenceNo",
                table: "Attachments",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<int>(
                name: "PublicityRank",
                table: "Attachments",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<int>(
                name: "PcoId",
                table: "Attachments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<string>(
                name: "OriginalBlobUrl",
                table: "Attachments",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Attachments",
                type: "nvarchar(1000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Attachments",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Attachments",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "FileNameExtension",
                table: "Attachments",
                type: "nvarchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "Attachments",
                type: "nvarchar(100)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Entity",
                table: "Attachments",
                type: "nvarchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "Attachments",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(9070));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(8917));

            migrationBuilder.AlterColumn<string>(
                name: "BlobUrl",
                table: "Attachments",
                type: "nvarchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "AttachmentType",
                table: "Attachments",
                type: "nvarchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(7085));

            migrationBuilder.AlterColumn<int>(
                name: "AnimalId",
                table: "Attachments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Attachments",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(102),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1818));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 319, DateTimeKind.Local).AddTicks(9890),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(1616));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2123, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(9119),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2123, 12, 7, 11, 4, 57, 909, DateTimeKind.Local).AddTicks(221));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(4677),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(6070));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 27, 17, 51, 24, 320, DateTimeKind.Local).AddTicks(4460),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 7, 11, 4, 57, 908, DateTimeKind.Local).AddTicks(5867));
        }
    }
}
