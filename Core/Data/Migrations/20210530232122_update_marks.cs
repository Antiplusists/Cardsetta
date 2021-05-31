using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Core.Migrations
{
    public partial class update_marks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeToRepeat",
                table: "Cards"
                );

            migrationBuilder.AddColumn<Dictionary<Guid, DateTimeOffset>>(
                name: "TimeToRepeat",
                table: "Cards",
                nullable: false,
                type: "jsonb",
                defaultValue: new Dictionary<Guid, DateTimeOffset>()
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeToRepeat",
                table: "Cards"
            );
            
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "TimeToRepeat",
                table: "Cards",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }
    }
}
