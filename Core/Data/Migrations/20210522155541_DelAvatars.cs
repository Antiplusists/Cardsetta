using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Data.Migrations
{
    public partial class DelAvatars : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);
        }
    }
}
