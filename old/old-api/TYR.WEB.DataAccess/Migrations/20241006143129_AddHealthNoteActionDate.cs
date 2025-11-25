using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TYR.WEB.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthNoteActionDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(6337),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2704));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(5849),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2255));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(9495),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5979));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(9010),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5489));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 546, DateTimeKind.Local).AddTicks(8978),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(8135));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 546, DateTimeKind.Local).AddTicks(8411),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(7537));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(3184),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1790));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(2689),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1344));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(4007),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3576));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(3538),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3224));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(1511),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1471));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(1065),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1069));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(6534),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5848));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(6117),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5487));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(8633),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8920));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(8169),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8517));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(5602),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(6249));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(5139),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(5856));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(5479),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1369));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(5075),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1027));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(4245),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(5445));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(4884),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(6025));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(8461),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9621));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(7949),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9137));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(1631),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(8177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(1145),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(7706));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 547, DateTimeKind.Local).AddTicks(8139),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9779));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 547, DateTimeKind.Local).AddTicks(7629),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9217));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(6609),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4664));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(5987),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4246));

            migrationBuilder.AddColumn<DateTime>(
                name: "ActionDate",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(2986),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3910));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(2502),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3487));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(1775),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(3144));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(1355),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(2757));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(7909),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(4205));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(1379),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2830));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(839),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2361));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 553, DateTimeKind.Local).AddTicks(6376),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2519));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 553, DateTimeKind.Local).AddTicks(5947),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2080));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 553, DateTimeKind.Local).AddTicks(2078),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(8370));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 556, DateTimeKind.Local).AddTicks(7478),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(9219));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 556, DateTimeKind.Local).AddTicks(6907),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(8721));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(1564),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7917));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(1188),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7583));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 549, DateTimeKind.Local).AddTicks(9169),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8495));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 549, DateTimeKind.Local).AddTicks(8608),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8005));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 555, DateTimeKind.Local).AddTicks(8741),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(1449));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 555, DateTimeKind.Local).AddTicks(8172),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(943));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(8432),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(4806));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(2371),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8688));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(1814),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8119));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(9098),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(4436));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(8557),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(3976));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActionDate",
                table: "HealthNotes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2704),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(6337));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(2255),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(5849));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5979),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(9495));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "VaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(5489),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(9010));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(8135),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 546, DateTimeKind.Local).AddTicks(8978));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Tenants",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 973, DateTimeKind.Local).AddTicks(7537),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 546, DateTimeKind.Local).AddTicks(8411));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1790),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(3184));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SOAPs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(1344),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(2689));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3576),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(4007));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVolunteerActivities",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(3224),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(3538));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1471),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(1511));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAVaccinationTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(1069),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(1065));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5848),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(6534));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAMedicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 986, DateTimeKind.Local).AddTicks(5487),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 559, DateTimeKind.Local).AddTicks(6117));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8920),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(8633));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAHealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(8517),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(8169));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(6249),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(5602));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SABehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(5856),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(5139));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1369),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(5479));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "SAAnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(1027),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(5075));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(5445),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(4245));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "PCOs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(6025),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(4884));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9621),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(8461));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Meds",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(9137),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(7949));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(8177),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(1631));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Medicines",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(7706),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(1145));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9779),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 547, DateTimeKind.Local).AddTicks(8139));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 974, DateTimeKind.Local).AddTicks(9217),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 547, DateTimeKind.Local).AddTicks(7629));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4664),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(6609));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "HealthNotes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 987, DateTimeKind.Local).AddTicks(4246),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 560, DateTimeKind.Local).AddTicks(5987));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3910),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(2986));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Donations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 985, DateTimeKind.Local).AddTicks(3487),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 558, DateTimeKind.Local).AddTicks(2502));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(3144),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(1775));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Diary",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 984, DateTimeKind.Local).AddTicks(2757),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 557, DateTimeKind.Local).AddTicks(1355));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Countries",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(4205),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 552, DateTimeKind.Local).AddTicks(7909));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2830),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(1379));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Behaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 975, DateTimeKind.Local).AddTicks(2361),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 548, DateTimeKind.Local).AddTicks(839));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2519),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 553, DateTimeKind.Local).AddTicks(6376));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(2080),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 553, DateTimeKind.Local).AddTicks(5947));

            migrationBuilder.AlterColumn<DateTime>(
                name: "AttachmentDate",
                table: "Attachments",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 980, DateTimeKind.Local).AddTicks(8370),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 553, DateTimeKind.Local).AddTicks(2078));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(9219),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 556, DateTimeKind.Local).AddTicks(7478));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalVaccinations",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(8721),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 556, DateTimeKind.Local).AddTicks(6907));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7917),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(1564));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalTypes",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 981, DateTimeKind.Local).AddTicks(7583),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(1188));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8495),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 549, DateTimeKind.Local).AddTicks(9169));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "Animals",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 976, DateTimeKind.Local).AddTicks(8005),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 549, DateTimeKind.Local).AddTicks(8608));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(1449),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 555, DateTimeKind.Local).AddTicks(8741));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalProcedures",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 983, DateTimeKind.Local).AddTicks(943),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 555, DateTimeKind.Local).AddTicks(8172));

            migrationBuilder.AlterColumn<DateTime>(
                name: "MilestoneDate",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(1924, 9, 25, 19, 42, 18, 979, DateTimeKind.Local).AddTicks(4806),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(1924, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(8432));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8688),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(2371));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalMilestones",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 978, DateTimeKind.Local).AddTicks(8119),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 551, DateTimeKind.Local).AddTicks(1814));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModified",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(4436),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(9098));

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateEntered",
                table: "AnimalBehaviors",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 9, 25, 19, 42, 18, 982, DateTimeKind.Local).AddTicks(3976),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 6, 20, 1, 27, 554, DateTimeKind.Local).AddTicks(8557));
        }
    }
}
