using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project.Migrations
{
    /// <inheritdoc />
    public partial class AutoSyncModelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookmark_Event_EventId",
                table: "Bookmark");

            migrationBuilder.DropForeignKey(
                name: "FK_Event_Users_OrganizerId",
                table: "Event");

            migrationBuilder.DropForeignKey(
                name: "FK_EventFaq_Event_EventId",
                table: "EventFaq");

            migrationBuilder.DropForeignKey(
                name: "FK_EventFeedback_Event_EventId",
                table: "EventFeedback");

            migrationBuilder.DropForeignKey(
                name: "FK_EventInvitation_Event_EventId",
                table: "EventInvitation");

            migrationBuilder.DropForeignKey(
                name: "FK_EventLog_Event_EventId",
                table: "EventLog");

            migrationBuilder.DropForeignKey(
                name: "FK_EventMedia_Event_EventId",
                table: "EventMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_EventOccurrence_Event_EventId",
                table: "EventOccurrence");

            migrationBuilder.DropForeignKey(
                name: "FK_EventSpeaker_Event_EventId",
                table: "EventSpeaker");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Event_EventId",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Event_EventId",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Event_EventId1",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Registration_Event_EventId",
                table: "Registration");

            migrationBuilder.DropForeignKey(
                name: "FK_Ticket_Event_EventId",
                table: "Ticket");

            migrationBuilder.DropForeignKey(
                name: "FK_Waitlist_Event_EventId",
                table: "Waitlist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Event",
                table: "Event");

            migrationBuilder.RenameTable(
                name: "Event",
                newName: "Events");

            migrationBuilder.RenameIndex(
                name: "IX_Event_OrganizerId",
                table: "Events",
                newName: "IX_Events_OrganizerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Events",
                table: "Events",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookmark_Events_EventId",
                table: "Bookmark",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventFaq_Events_EventId",
                table: "EventFaq",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventFeedback_Events_EventId",
                table: "EventFeedback",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventInvitation_Events_EventId",
                table: "EventInvitation",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventLog_Events_EventId",
                table: "EventLog",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventMedia_Events_EventId",
                table: "EventMedia",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventOccurrence_Events_EventId",
                table: "EventOccurrence",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_OrganizerId",
                table: "Events",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventSpeaker_Events_EventId",
                table: "EventSpeaker",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Events_EventId",
                table: "Notification",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Events_EventId",
                table: "Payment",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Events_EventId1",
                table: "Payment",
                column: "EventId1",
                principalTable: "Events",
                principalColumn: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Registration_Events_EventId",
                table: "Registration",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ticket_Events_EventId",
                table: "Ticket",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Waitlist_Events_EventId",
                table: "Waitlist",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookmark_Events_EventId",
                table: "Bookmark");

            migrationBuilder.DropForeignKey(
                name: "FK_EventFaq_Events_EventId",
                table: "EventFaq");

            migrationBuilder.DropForeignKey(
                name: "FK_EventFeedback_Events_EventId",
                table: "EventFeedback");

            migrationBuilder.DropForeignKey(
                name: "FK_EventInvitation_Events_EventId",
                table: "EventInvitation");

            migrationBuilder.DropForeignKey(
                name: "FK_EventLog_Events_EventId",
                table: "EventLog");

            migrationBuilder.DropForeignKey(
                name: "FK_EventMedia_Events_EventId",
                table: "EventMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_EventOccurrence_Events_EventId",
                table: "EventOccurrence");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_OrganizerId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_EventSpeaker_Events_EventId",
                table: "EventSpeaker");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Events_EventId",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Events_EventId",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Events_EventId1",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Registration_Events_EventId",
                table: "Registration");

            migrationBuilder.DropForeignKey(
                name: "FK_Ticket_Events_EventId",
                table: "Ticket");

            migrationBuilder.DropForeignKey(
                name: "FK_Waitlist_Events_EventId",
                table: "Waitlist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Events",
                table: "Events");

            migrationBuilder.RenameTable(
                name: "Events",
                newName: "Event");

            migrationBuilder.RenameIndex(
                name: "IX_Events_OrganizerId",
                table: "Event",
                newName: "IX_Event_OrganizerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Event",
                table: "Event",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookmark_Event_EventId",
                table: "Bookmark",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Users_OrganizerId",
                table: "Event",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventFaq_Event_EventId",
                table: "EventFaq",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventFeedback_Event_EventId",
                table: "EventFeedback",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventInvitation_Event_EventId",
                table: "EventInvitation",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventLog_Event_EventId",
                table: "EventLog",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventMedia_Event_EventId",
                table: "EventMedia",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventOccurrence_Event_EventId",
                table: "EventOccurrence",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventSpeaker_Event_EventId",
                table: "EventSpeaker",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Event_EventId",
                table: "Notification",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Event_EventId",
                table: "Payment",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Event_EventId1",
                table: "Payment",
                column: "EventId1",
                principalTable: "Event",
                principalColumn: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Registration_Event_EventId",
                table: "Registration",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ticket_Event_EventId",
                table: "Ticket",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Waitlist_Event_EventId",
                table: "Waitlist",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
