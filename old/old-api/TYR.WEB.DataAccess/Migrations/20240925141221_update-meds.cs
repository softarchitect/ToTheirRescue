using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TYR.WEB.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Administered",
                table: "Meds",
                newName: "Reminder");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2704),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(623));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2255),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(300));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5979),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(4619));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5489),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(4280));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(8135),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 438, DateTimeKind.Local).AddTicks(6070));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(7537),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 437, DateTimeKind.Local).AddTicks(1758));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1790),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(5760));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1344),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(5395));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3576),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(7413));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3224),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(7105));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1471),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(5267));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1069),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(4962));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5848),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(56));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5487),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(9750));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8920),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(2533));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8517),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(2170));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(6249),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(9643));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(5856),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(9317));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1369),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(8843));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1027),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(8517));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(5445),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 440, DateTimeKind.Local).AddTicks(1053));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(6025),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 440, DateTimeKind.Local).AddTicks(1486));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9621),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(1411));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9137),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(1109));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(8177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(7043));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(7706),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(6654));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9779),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(4918));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9217),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(4003));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4664),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(8676));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4246),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(8358));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3910),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(7215));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3487),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(6958));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(3144),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(6284));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(2757),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(6056));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(4205),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(2525));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2830),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(8168));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2361),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(7806));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2519),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(9629));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2080),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(9390));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(8370),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(6903));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(9219),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(2839));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(8721),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(2578));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(4495));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7583),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(4229));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8495),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 441, DateTimeKind.Local).AddTicks(4600));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8005),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 441, DateTimeKind.Local).AddTicks(4119));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(1449),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(7465));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(943),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(7205));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(4806),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(3384));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8688),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 442, DateTimeKind.Local).AddTicks(6723));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8119),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 442, DateTimeKind.Local).AddTicks(6225));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(4436),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(2354));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(3976),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(2029));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Reminder",
                table: "Meds",
                newName: "Administered");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(623),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2704));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(300),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2255));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(4619),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5979));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(4280),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5489));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 438, DateTimeKind.Local).AddTicks(6070),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(8135));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 437, DateTimeKind.Local).AddTicks(1758),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(7537));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(5760),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1790));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(5395),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1344));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(7413),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3576));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(7105),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3224));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(5267),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1471));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(4962),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1069));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(56),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5848));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(9750),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5487));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(2533),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8920));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 449, DateTimeKind.Local).AddTicks(2170),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8517));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(9643),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(6249));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(9317),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(5856));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(8843),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1369));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(8517),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1027));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 440, DateTimeKind.Local).AddTicks(1053),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(5445));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 440, DateTimeKind.Local).AddTicks(1486),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(6025));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(1411),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9621));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(1109),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9137));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(7043),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(8177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(6654),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(7706));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(4918),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9779));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(4003),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9217));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(8676),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4664));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 450, DateTimeKind.Local).AddTicks(8358),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4246));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(7215),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3910));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 448, DateTimeKind.Local).AddTicks(6958),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3487));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(6284),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(3144));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(6056),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(2757));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(2525),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(4205));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(8168),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2830));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 439, DateTimeKind.Local).AddTicks(7806),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2361));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(9629),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2519));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(9390),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2080));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 444, DateTimeKind.Local).AddTicks(6903),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(8370));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(2839),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(9219));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 447, DateTimeKind.Local).AddTicks(2578),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(8721));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(4495),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7917));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 445, DateTimeKind.Local).AddTicks(4229),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7583));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 441, DateTimeKind.Local).AddTicks(4600),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8495));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 441, DateTimeKind.Local).AddTicks(4119),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8005));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(7465),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(1449));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(7205),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(943));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 8, 27, 18, 33, 8, 443, DateTimeKind.Local).AddTicks(3384),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(4806));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 442, DateTimeKind.Local).AddTicks(6723),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8688));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 442, DateTimeKind.Local).AddTicks(6225),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8119));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(2354),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(4436));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 8, 27, 18, 33, 8, 446, DateTimeKind.Local).AddTicks(2029),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(3976));
        }
    }
}
