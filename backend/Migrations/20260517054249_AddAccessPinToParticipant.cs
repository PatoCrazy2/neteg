using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAccessPinToParticipant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Participants_EventId",
                table: "Participants");

            migrationBuilder.AddColumn<string>(
                name: "AccessPin",
                table: "Participants",
                type: "character varying(6)",
                maxLength: 6,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Participants_EventId_AccessPin",
                table: "Participants",
                columns: new[] { "EventId", "AccessPin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Participants_EventId_AccessPin",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "AccessPin",
                table: "Participants");

            migrationBuilder.CreateIndex(
                name: "IX_Participants_EventId",
                table: "Participants",
                column: "EventId");
        }
    }
}
