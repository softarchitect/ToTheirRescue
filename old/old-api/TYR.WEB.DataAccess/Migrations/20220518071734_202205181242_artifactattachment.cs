using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class _202205181242_ArtifactAttachment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(6255),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(9546));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(5824),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(9022));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(6489),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 159, DateTimeKind.Local).AddTicks(6805));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(5922),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 159, DateTimeKind.Local).AddTicks(5798));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8903),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 163, DateTimeKind.Local).AddTicks(8183));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8402),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 163, DateTimeKind.Local).AddTicks(7522));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 899, DateTimeKind.Local).AddTicks(8563),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(4577));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 896, DateTimeKind.Local).AddTicks(5490),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 153, DateTimeKind.Local).AddTicks(4149));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "05/18/2022 12:47:33",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "04/21/2022 13:09:44");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5168),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 157, DateTimeKind.Local).AddTicks(915));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5682),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 157, DateTimeKind.Local).AddTicks(1358));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2659),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(8487));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2170),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(8023));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1841),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(3313));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1422),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(2389));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1091),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(7075));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(6053));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(4203),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(9742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(3771),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(9346));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(8744),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 165, DateTimeKind.Local).AddTicks(2136));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9568),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 160, DateTimeKind.Local).AddTicks(4810));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9055),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 160, DateTimeKind.Local).AddTicks(3841));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2122, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(7247),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2122, 4, 21, 13, 9, 44, 163, DateTimeKind.Local).AddTicks(5310));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7995),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 161, DateTimeKind.Local).AddTicks(9661));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 161, DateTimeKind.Local).AddTicks(8850));

            migrationBuilder.CreateTable(
                name: "Attachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Entity = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    AttachmentType = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    FileName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    FileNameExtension = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    AttachmentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    PublicityRank = table.Column<int>(type: "int", nullable: false),
                    SequenceNo = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    OriginalBlobUrl = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    BlobUrl = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    ThumbnailBlobUrl = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    DateEntered = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EnteredBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    PcoId = table.Column<int>(type: "int", nullable: true),
                    AnimalId = table.Column<int>(type: "int", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachments_Animals_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Attachments_PCOs_PcoId",
                        column: x => x.PcoId,
                        principalTable: "PCOs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Attachments_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_AnimalId",
                table: "Attachments",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_PcoId",
                table: "Attachments",
                column: "PcoId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_TenantId",
                table: "Attachments",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(9546),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(6255));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(9022),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(5824));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 159, DateTimeKind.Local).AddTicks(6805),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(6489));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 159, DateTimeKind.Local).AddTicks(5798),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(5922));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 163, DateTimeKind.Local).AddTicks(8183),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8903));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 163, DateTimeKind.Local).AddTicks(7522),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(8402));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(4577),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 899, DateTimeKind.Local).AddTicks(8563));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 153, DateTimeKind.Local).AddTicks(4149),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 896, DateTimeKind.Local).AddTicks(5490));

            migrationBuilder.AlterColumn<string>(
                name: "EnteredBy",
                table: "PCOs",
                type: "nvarchar(256)",
                nullable: true,
                defaultValue: "04/21/2022 13:09:44",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldNullable: true,
                oldDefaultValue: "05/18/2022 12:47:33");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 157, DateTimeKind.Local).AddTicks(915),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5168));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 157, DateTimeKind.Local).AddTicks(1358),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(5682));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(8487),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2659));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(8023),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(2170));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(3313),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1841));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 164, DateTimeKind.Local).AddTicks(2389),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(1422));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(7075),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1091));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(6053),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(1));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(9742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(4203));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 156, DateTimeKind.Local).AddTicks(9346),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 900, DateTimeKind.Local).AddTicks(3771));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 165, DateTimeKind.Local).AddTicks(2136),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 905, DateTimeKind.Local).AddTicks(8744));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 160, DateTimeKind.Local).AddTicks(4810),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9568));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 160, DateTimeKind.Local).AddTicks(3841),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 902, DateTimeKind.Local).AddTicks(9055));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2122, 4, 21, 13, 9, 44, 163, DateTimeKind.Local).AddTicks(5310),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2122, 5, 18, 12, 47, 33, 904, DateTimeKind.Local).AddTicks(7247));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 161, DateTimeKind.Local).AddTicks(9661),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7995));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 4, 21, 13, 9, 44, 161, DateTimeKind.Local).AddTicks(8850),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 5, 18, 12, 47, 33, 903, DateTimeKind.Local).AddTicks(7408));
        }
    }
}
