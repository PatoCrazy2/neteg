using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TicketJobId",
                table: "Participants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TicketStatus",
                table: "Participants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TicketUrl",
                table: "Participants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GenerateTickets",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TicketJobId",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "TicketStatus",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "TicketUrl",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "GenerateTickets",
                table: "Events");
        }
    }
}
