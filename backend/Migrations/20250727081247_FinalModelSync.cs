using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project.Migrations
{
    /// <inheritdoc />
    public partial class FinalModelSync : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventFaq_Events_EventId",
                table: "EventFaq");

            migrationBuilder.DropForeignKey(
                name: "FK_EventMedia_Events_EventId",
                table: "EventMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_EventOccurrence_Events_EventId",
                table: "EventOccurrence");

            migrationBuilder.DropForeignKey(
                name: "FK_EventSpeaker_Events_EventId",
                table: "EventSpeaker");

            migrationBuilder.DropForeignKey(
                name: "FK_Registration_EventOccurrence_OccurrenceId",
                table: "Registration");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventSpeaker",
                table: "EventSpeaker");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventOccurrence",
                table: "EventOccurrence");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventMedia",
                table: "EventMedia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventFaq",
                table: "EventFaq");

            migrationBuilder.RenameTable(
                name: "EventSpeaker",
                newName: "EventSpeakers");

            migrationBuilder.RenameTable(
                name: "EventOccurrence",
                newName: "EventOccurrences");

            migrationBuilder.RenameTable(
                name: "EventMedia",
                newName: "EventMedias");

            migrationBuilder.RenameTable(
                name: "EventFaq",
                newName: "EventFaqs");

            migrationBuilder.RenameIndex(
                name: "IX_EventSpeaker_EventId",
                table: "EventSpeakers",
                newName: "IX_EventSpeakers_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventOccurrence_EventId",
                table: "EventOccurrences",
                newName: "IX_EventOccurrences_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventMedia_EventId",
                table: "EventMedias",
                newName: "IX_EventMedias_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventFaq_EventId",
                table: "EventFaqs",
                newName: "IX_EventFaqs_EventId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventSpeakers",
                table: "EventSpeakers",
                column: "SpeakerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventOccurrences",
                table: "EventOccurrences",
                column: "OccurrenceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventMedias",
                table: "EventMedias",
                column: "MediaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventFaqs",
                table: "EventFaqs",
                column: "FaqId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventFaqs_Events_EventId",
                table: "EventFaqs",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventMedias_Events_EventId",
                table: "EventMedias",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventOccurrences_Events_EventId",
                table: "EventOccurrences",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventSpeakers_Events_EventId",
                table: "EventSpeakers",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Registration_EventOccurrences_OccurrenceId",
                table: "Registration",
                column: "OccurrenceId",
                principalTable: "EventOccurrences",
                principalColumn: "OccurrenceId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventFaqs_Events_EventId",
                table: "EventFaqs");

            migrationBuilder.DropForeignKey(
                name: "FK_EventMedias_Events_EventId",
                table: "EventMedias");

            migrationBuilder.DropForeignKey(
                name: "FK_EventOccurrences_Events_EventId",
                table: "EventOccurrences");

            migrationBuilder.DropForeignKey(
                name: "FK_EventSpeakers_Events_EventId",
                table: "EventSpeakers");

            migrationBuilder.DropForeignKey(
                name: "FK_Registration_EventOccurrences_OccurrenceId",
                table: "Registration");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventSpeakers",
                table: "EventSpeakers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventOccurrences",
                table: "EventOccurrences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventMedias",
                table: "EventMedias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventFaqs",
                table: "EventFaqs");

            migrationBuilder.RenameTable(
                name: "EventSpeakers",
                newName: "EventSpeaker");

            migrationBuilder.RenameTable(
                name: "EventOccurrences",
                newName: "EventOccurrence");

            migrationBuilder.RenameTable(
                name: "EventMedias",
                newName: "EventMedia");

            migrationBuilder.RenameTable(
                name: "EventFaqs",
                newName: "EventFaq");

            migrationBuilder.RenameIndex(
                name: "IX_EventSpeakers_EventId",
                table: "EventSpeaker",
                newName: "IX_EventSpeaker_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventOccurrences_EventId",
                table: "EventOccurrence",
                newName: "IX_EventOccurrence_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventMedias_EventId",
                table: "EventMedia",
                newName: "IX_EventMedia_EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventFaqs_EventId",
                table: "EventFaq",
                newName: "IX_EventFaq_EventId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventSpeaker",
                table: "EventSpeaker",
                column: "SpeakerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventOccurrence",
                table: "EventOccurrence",
                column: "OccurrenceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventMedia",
                table: "EventMedia",
                column: "MediaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventFaq",
                table: "EventFaq",
                column: "FaqId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventFaq_Events_EventId",
                table: "EventFaq",
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
                name: "FK_EventSpeaker_Events_EventId",
                table: "EventSpeaker",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Registration_EventOccurrence_OccurrenceId",
                table: "Registration",
                column: "OccurrenceId",
                principalTable: "EventOccurrence",
                principalColumn: "OccurrenceId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
