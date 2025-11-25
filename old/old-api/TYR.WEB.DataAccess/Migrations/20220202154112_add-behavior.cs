using Microsoft.EntityFrameworkCore.Migrations;

namespace TYR.WEB.DataAccess.Migrations
{
    public partial class AddBehavior : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Behaviors_AnimalTypes_AnimalTypeId",
                table: "Behaviors");

            migrationBuilder.DropForeignKey(
                name: "FK_Behaviors_Tenants_TenantId",
                table: "Behaviors");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Behaviors",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "AnimalTypeId",
                table: "Behaviors",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Behaviors_AnimalTypes_AnimalTypeId",
                table: "Behaviors",
                column: "AnimalTypeId",
                principalTable: "AnimalTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Behaviors_Tenants_TenantId",
                table: "Behaviors",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Behaviors_AnimalTypes_AnimalTypeId",
                table: "Behaviors");

            migrationBuilder.DropForeignKey(
                name: "FK_Behaviors_Tenants_TenantId",
                table: "Behaviors");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Behaviors",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AnimalTypeId",
                table: "Behaviors",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Behaviors_AnimalTypes_AnimalTypeId",
                table: "Behaviors",
                column: "AnimalTypeId",
                principalTable: "AnimalTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Behaviors_Tenants_TenantId",
                table: "Behaviors",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
