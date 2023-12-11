using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ranking_app.Migrations
{
    /// <inheritdoc />
    public partial class AddRankedElementToContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RankedElement_Tierlists_TierlistModelId",
                table: "RankedElement");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RankedElement",
                table: "RankedElement");

            migrationBuilder.RenameTable(
                name: "RankedElement",
                newName: "RankedElements");

            migrationBuilder.RenameIndex(
                name: "IX_RankedElement_TierlistModelId",
                table: "RankedElements",
                newName: "IX_RankedElements_TierlistModelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RankedElements",
                table: "RankedElements",
                column: "ElementId");

            migrationBuilder.AddForeignKey(
                name: "FK_RankedElements_Tierlists_TierlistModelId",
                table: "RankedElements",
                column: "TierlistModelId",
                principalTable: "Tierlists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RankedElements_Tierlists_TierlistModelId",
                table: "RankedElements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RankedElements",
                table: "RankedElements");

            migrationBuilder.RenameTable(
                name: "RankedElements",
                newName: "RankedElement");

            migrationBuilder.RenameIndex(
                name: "IX_RankedElements_TierlistModelId",
                table: "RankedElement",
                newName: "IX_RankedElement_TierlistModelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RankedElement",
                table: "RankedElement",
                column: "ElementId");

            migrationBuilder.AddForeignKey(
                name: "FK_RankedElement_Tierlists_TierlistModelId",
                table: "RankedElement",
                column: "TierlistModelId",
                principalTable: "Tierlists",
                principalColumn: "Id");
        }
    }
}
