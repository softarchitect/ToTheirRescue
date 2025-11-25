using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class VolunteerActivitiesMedicineUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medicines_AnimalTypes_AnimalTypeId",
                table: "Medicines");

            migrationBuilder.DropIndex(
                name: "IX_Medicines_AnimalTypeId",
                table: "Medicines");

            migrationBuilder.DropColumn(
                name: "AnimalTypeId",
                table: "Medicines");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(7632),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 361, DateTimeKind.Local).AddTicks(7671));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(7331),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 361, DateTimeKind.Local).AddTicks(6978));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(1882),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(5949));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(1521),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(5522));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(7929),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(6624));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(8579),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(7869));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(4582),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(325));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(4157),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 358, DateTimeKind.Local).AddTicks(9669));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(4014),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(9854));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(3733),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(8821));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(3031),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 358, DateTimeKind.Local).AddTicks(7513));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 156, DateTimeKind.Local).AddTicks(3747),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 352, DateTimeKind.Local).AddTicks(3228));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(5685),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(2567));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(5380),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(1893));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(9872),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 362, DateTimeKind.Local).AddTicks(2365));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(9570),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 362, DateTimeKind.Local).AddTicks(1674));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 168, DateTimeKind.Local).AddTicks(5609),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 363, DateTimeKind.Local).AddTicks(1680));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 168, DateTimeKind.Local).AddTicks(5224),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 363, DateTimeKind.Local).AddTicks(1106));

            migrationBuilder.CreateTable(
                name: "VolunteerActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VolunteerActivityName = table.Column<string>(type: "nvarchar(75)", nullable: true, defaultValue: ""),
                    DateEntered = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(6478)),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(6813)),
                    EnteredBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    TenantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VolunteerActivities_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerActivities_TenantId",
                table: "VolunteerActivities",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VolunteerActivities");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 361, DateTimeKind.Local).AddTicks(7671),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(7632));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Vets",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 361, DateTimeKind.Local).AddTicks(6978),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(7331));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(5949),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(1882));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(5522),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(1521));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(6624),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(7929));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(7869),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(8579));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(325),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(4582));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 358, DateTimeKind.Local).AddTicks(9669),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(4157));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(9854),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(4014));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 365, DateTimeKind.Local).AddTicks(8821),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 169, DateTimeKind.Local).AddTicks(3733));

            migrationBuilder.AddColumn<int>(
                name: "AnimalTypeId",
                table: "Medicines",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 358, DateTimeKind.Local).AddTicks(7513),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(3031));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 352, DateTimeKind.Local).AddTicks(3228),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 156, DateTimeKind.Local).AddTicks(3747));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(2567),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(5685));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 359, DateTimeKind.Local).AddTicks(1893),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 166, DateTimeKind.Local).AddTicks(5380));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 362, DateTimeKind.Local).AddTicks(2365),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(9872));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 362, DateTimeKind.Local).AddTicks(1674),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 167, DateTimeKind.Local).AddTicks(9570));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 363, DateTimeKind.Local).AddTicks(1680),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 168, DateTimeKind.Local).AddTicks(5609));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 21, 12, 30, 48, 363, DateTimeKind.Local).AddTicks(1106),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 22, 12, 40, 52, 168, DateTimeKind.Local).AddTicks(5224));

            migrationBuilder.CreateIndex(
                name: "IX_Medicines_AnimalTypeId",
                table: "Medicines",
                column: "AnimalTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Medicines_AnimalTypes_AnimalTypeId",
                table: "Medicines",
                column: "AnimalTypeId",
                principalTable: "AnimalTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
