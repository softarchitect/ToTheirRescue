using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class _20220210204345_Update_Pco : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(9289),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 265, DateTimeKind.Local).AddTicks(2326));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 913, DateTimeKind.Local).AddTicks(189),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 265, DateTimeKind.Local).AddTicks(3067));

            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                table: "PCOs",
                type: "nvarchar(150)",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(4695),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8429));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(4234),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8065));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(2774),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(6701));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 909, DateTimeKind.Local).AddTicks(1701),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 262, DateTimeKind.Local).AddTicks(1773));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(6066),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9596));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(5596),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9261));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "PCOs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 265, DateTimeKind.Local).AddTicks(2326),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(9289));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 265, DateTimeKind.Local).AddTicks(3067),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 913, DateTimeKind.Local).AddTicks(189));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8429),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(4695));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "OtherRescueShelters",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(8065),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(4234));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(6701),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(2774));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HospitalClinics",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 262, DateTimeKind.Local).AddTicks(1773),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 909, DateTimeKind.Local).AddTicks(1701));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9596),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(6066));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2022, 2, 7, 22, 36, 21, 264, DateTimeKind.Local).AddTicks(9261),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2022, 2, 10, 20, 44, 24, 912, DateTimeKind.Local).AddTicks(5596));
        }
    }
}
