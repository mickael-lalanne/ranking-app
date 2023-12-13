using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ranking_app.Migrations
{
    /// <inheritdoc />
    public partial class AddTierToContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tier_Templates_TemplateModelId",
                table: "Tier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tier",
                table: "Tier");

            migrationBuilder.RenameTable(
                name: "Tier",
                newName: "Tiers");

            migrationBuilder.RenameIndex(
                name: "IX_Tier_TemplateModelId",
                table: "Tiers",
                newName: "IX_Tiers_TemplateModelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tiers",
                table: "Tiers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tiers_Templates_TemplateModelId",
                table: "Tiers",
                column: "TemplateModelId",
                principalTable: "Templates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tiers_Templates_TemplateModelId",
                table: "Tiers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tiers",
                table: "Tiers");

            migrationBuilder.RenameTable(
                name: "Tiers",
                newName: "Tier");

            migrationBuilder.RenameIndex(
                name: "IX_Tiers_TemplateModelId",
                table: "Tier",
                newName: "IX_Tier_TemplateModelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tier",
                table: "Tier",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tier_Templates_TemplateModelId",
                table: "Tier",
                column: "TemplateModelId",
                principalTable: "Templates",
                principalColumn: "Id");
        }
    }
}
