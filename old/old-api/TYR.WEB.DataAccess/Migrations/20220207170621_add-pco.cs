using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class AddPco : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8429),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(3420));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8065),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(3082));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(6701),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(1945));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 262, DateTimeKind.Local).AddTicks(1773),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 267, DateTimeKind.Local).AddTicks(8095));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9596),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(4597));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9261),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(4273));

            migrationBuilder.CreateTable(
                name: "PCOs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SystemRecord = table.Column<bool>(type: "bit", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false, defaultValue: ""),
                    LastName = table.Column<string>(type: "nvarchar(256)", nullable: false, defaultValue: ""),
                    Street = table.Column<string>(type: "nvarchar(150)", nullable: false, defaultValue: ""),
                    Street2 = table.Column<string>(type: "nvarchar(150)", nullable: true, defaultValue: ""),
                    City = table.Column<string>(type: "nvarchar(150)", nullable: false, defaultValue: ""),
                    State = table.Column<string>(type: "nvarchar(3)", nullable: true, defaultValue: ""),
                    Zip = table.Column<string>(type: "nvarchar(15)", nullable: true, defaultValue: ""),
                    Phone = table.Column<string>(type: "nvarchar(20)", nullable: true, defaultValue: ""),
                    OtherPhone = table.Column<string>(type: "nvarchar(20)", nullable: true, defaultValue: ""),
                    Email = table.Column<string>(type: "nvarchar(50)", nullable: true, defaultValue: ""),
                    MailList = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Website = table.Column<string>(type: "nvarchar(100)", nullable: true, defaultValue: ""),
                    Contact = table.Column<string>(type: "nvarchar(50)", nullable: true, defaultValue: ""),
                    RescueContact = table.Column<string>(type: "nvarchar(50)", nullable: true, defaultValue: ""),
                    Notes = table.Column<string>(type: "nvarchar(4000)", nullable: true, defaultValue: ""),
                    EntityType = table.Column<string>(type: "nvarchar(10)", nullable: true, defaultValue: ""),
                    Hospital = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Rescue = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Flag = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FlagReason = table.Column<string>(type: "nvarchar(50)", nullable: true, defaultValue: ""),
                    DateEntered = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 265, DateTimeKind.Local).AddTicks(3067)),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 265, DateTimeKind.Local).AddTicks(2326)),
                    EnteredBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    TenantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PCOs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PCOs_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PCOs_TenantId",
                table: "PCOs",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PCOs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(3420),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8429));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(3082),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8065));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(1945),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(6701));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 267, DateTimeKind.Local).AddTicks(8095),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 262, DateTimeKind.Local).AddTicks(1773));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(4597),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9596));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 21, 4, 27, 270, DateTimeKind.Local).AddTicks(4273),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9261));
        }
    }
}
