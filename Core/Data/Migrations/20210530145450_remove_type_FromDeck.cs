using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class remove_type_FromDeck : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Cards");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Cards",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
