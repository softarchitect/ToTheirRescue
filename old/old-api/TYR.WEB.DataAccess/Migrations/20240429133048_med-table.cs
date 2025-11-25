using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class MedTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 914, DateTimeKind.Local).AddTicks(1499),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(6742));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 914, DateTimeKind.Local).AddTicks(548),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(6184));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 909, DateTimeKind.Local).AddTicks(319),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 693, DateTimeKind.Local).AddTicks(4721));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 908, DateTimeKind.Local).AddTicks(9670),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 693, DateTimeKind.Local).AddTicks(3934));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 912, DateTimeKind.Local).AddTicks(9613),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 697, DateTimeKind.Local).AddTicks(7198));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 912, DateTimeKind.Local).AddTicks(8951),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 697, DateTimeKind.Local).AddTicks(6606));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 905, DateTimeKind.Local).AddTicks(768),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 686, DateTimeKind.Local).AddTicks(7090));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 904, DateTimeKind.Local).AddTicks(592),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 679, DateTimeKind.Local).AddTicks(13));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(8478),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 701, DateTimeKind.Local).AddTicks(7324));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(8099),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 701, DateTimeKind.Local).AddTicks(6794));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(9724),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 690, DateTimeKind.Local).AddTicks(5660));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 907, DateTimeKind.Local).AddTicks(672),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 690, DateTimeKind.Local).AddTicks(6566));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(1580),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 689, DateTimeKind.Local).AddTicks(644));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(1181),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 688, DateTimeKind.Local).AddTicks(9729));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 913, DateTimeKind.Local).AddTicks(4556),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(1402));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 913, DateTimeKind.Local).AddTicks(3788),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(825));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 905, DateTimeKind.Local).AddTicks(7117),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 688, DateTimeKind.Local).AddTicks(237));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 905, DateTimeKind.Local).AddTicks(5643),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 687, DateTimeKind.Local).AddTicks(8135));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(5237),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 689, DateTimeKind.Local).AddTicks(8439));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(4803),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 689, DateTimeKind.Local).AddTicks(7537));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(7916),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 704, DateTimeKind.Local).AddTicks(2217));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(7622),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 704, DateTimeKind.Local).AddTicks(1844));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 914, DateTimeKind.Local).AddTicks(5866),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 699, DateTimeKind.Local).AddTicks(422));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 915, DateTimeKind.Local).AddTicks(7149),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 700, DateTimeKind.Local).AddTicks(1718));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 915, DateTimeKind.Local).AddTicks(6824),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 700, DateTimeKind.Local).AddTicks(1284));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 915, DateTimeKind.Local).AddTicks(2235),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 699, DateTimeKind.Local).AddTicks(6327));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(4177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(7229));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(3872),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(6833));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(3634),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 701, DateTimeKind.Local).AddTicks(108));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(3309),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 700, DateTimeKind.Local).AddTicks(9601));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 909, DateTimeKind.Local).AddTicks(4571),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 694, DateTimeKind.Local).AddTicks(432));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 909, DateTimeKind.Local).AddTicks(4151),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 693, DateTimeKind.Local).AddTicks(9715));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(8945),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(582));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(8631),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(178));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 4, 29, 19, 0, 47, 912, DateTimeKind.Local).AddTicks(6347),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 4, 25, 17, 26, 57, 697, DateTimeKind.Local).AddTicks(4920));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 911, DateTimeKind.Local).AddTicks(6538),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 696, DateTimeKind.Local).AddTicks(965));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 911, DateTimeKind.Local).AddTicks(5586),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 696, DateTimeKind.Local).AddTicks(226));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(2270),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 702, DateTimeKind.Local).AddTicks(3365));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(1916),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 702, DateTimeKind.Local).AddTicks(2869));

            migrationBuilder.CreateTable(
                name: "Meds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnimalId = table.Column<int>(type: "int", nullable: true),
                    MedicineId = table.Column<int>(type: "int", nullable: true),
                    AdministeredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DosagePrescription = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true, defaultValue: ""),
                    Notes = table.Column<string>(type: "nvarchar(max)", maxLength: 4000, nullable: true, defaultValue: ""),
                    AdministeredBy = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true, defaultValue: ""),
                    DateEntered = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 919, DateTimeKind.Local).AddTicks(1951)),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 919, DateTimeKind.Local).AddTicks(2886)),
                    EnteredBy = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true, defaultValue: ""),
                    ModifiedBy = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true, defaultValue: ""),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    TenantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Meds_Animals_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Meds_Medicines_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "Medicines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Meds_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Meds_AnimalId",
                table: "Meds",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_Meds_MedicineId",
                table: "Meds",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_Meds_TenantId",
                table: "Meds",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Meds");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(6742),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 914, DateTimeKind.Local).AddTicks(1499));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(6184),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 914, DateTimeKind.Local).AddTicks(548));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 693, DateTimeKind.Local).AddTicks(4721),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 909, DateTimeKind.Local).AddTicks(319));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 693, DateTimeKind.Local).AddTicks(3934),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 908, DateTimeKind.Local).AddTicks(9670));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 697, DateTimeKind.Local).AddTicks(7198),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 912, DateTimeKind.Local).AddTicks(9613));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 697, DateTimeKind.Local).AddTicks(6606),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 912, DateTimeKind.Local).AddTicks(8951));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 686, DateTimeKind.Local).AddTicks(7090),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 905, DateTimeKind.Local).AddTicks(768));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 679, DateTimeKind.Local).AddTicks(13),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 904, DateTimeKind.Local).AddTicks(592));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 701, DateTimeKind.Local).AddTicks(7324),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(8478));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 701, DateTimeKind.Local).AddTicks(6794),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(8099));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 690, DateTimeKind.Local).AddTicks(5660),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(9724));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 690, DateTimeKind.Local).AddTicks(6566),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 907, DateTimeKind.Local).AddTicks(672));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 689, DateTimeKind.Local).AddTicks(644),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(1580));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 688, DateTimeKind.Local).AddTicks(9729),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(1181));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(1402),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 913, DateTimeKind.Local).AddTicks(4556));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 698, DateTimeKind.Local).AddTicks(825),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 913, DateTimeKind.Local).AddTicks(3788));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 688, DateTimeKind.Local).AddTicks(237),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 905, DateTimeKind.Local).AddTicks(7117));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 687, DateTimeKind.Local).AddTicks(8135),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 905, DateTimeKind.Local).AddTicks(5643));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 689, DateTimeKind.Local).AddTicks(8439),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(5237));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 689, DateTimeKind.Local).AddTicks(7537),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 906, DateTimeKind.Local).AddTicks(4803));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 704, DateTimeKind.Local).AddTicks(2217),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(7916));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 704, DateTimeKind.Local).AddTicks(1844),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(7622));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 699, DateTimeKind.Local).AddTicks(422),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 914, DateTimeKind.Local).AddTicks(5866));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 700, DateTimeKind.Local).AddTicks(1718),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 915, DateTimeKind.Local).AddTicks(7149));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 700, DateTimeKind.Local).AddTicks(1284),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 915, DateTimeKind.Local).AddTicks(6824));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 699, DateTimeKind.Local).AddTicks(6327),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 915, DateTimeKind.Local).AddTicks(2235));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(7229),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(4177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(6833),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 918, DateTimeKind.Local).AddTicks(3872));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 701, DateTimeKind.Local).AddTicks(108),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(3634));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 700, DateTimeKind.Local).AddTicks(9601),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 916, DateTimeKind.Local).AddTicks(3309));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 694, DateTimeKind.Local).AddTicks(432),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 909, DateTimeKind.Local).AddTicks(4571));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 693, DateTimeKind.Local).AddTicks(9715),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 909, DateTimeKind.Local).AddTicks(4151));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(582),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(8945));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 703, DateTimeKind.Local).AddTicks(178),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(8631));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 4, 25, 17, 26, 57, 697, DateTimeKind.Local).AddTicks(4920),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 4, 29, 19, 0, 47, 912, DateTimeKind.Local).AddTicks(6347));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 696, DateTimeKind.Local).AddTicks(965),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 911, DateTimeKind.Local).AddTicks(6538));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 696, DateTimeKind.Local).AddTicks(226),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 911, DateTimeKind.Local).AddTicks(5586));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 702, DateTimeKind.Local).AddTicks(3365),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(2270));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 4, 25, 17, 26, 57, 702, DateTimeKind.Local).AddTicks(2869),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 4, 29, 19, 0, 47, 917, DateTimeKind.Local).AddTicks(1916));
        }
    }
}
