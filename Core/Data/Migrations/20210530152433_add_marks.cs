using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class add_marks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Dictionary<Guid, int>>(
                name: "Marks",
                table: "Cards",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "TimeToRepeat",
                table: "Cards",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Marks",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "TimeToRepeat",
                table: "Cards");
        }
    }
}
