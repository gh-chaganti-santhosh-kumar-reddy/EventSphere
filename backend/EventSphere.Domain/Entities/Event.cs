using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventSphere.Domain.Entities
{
    public enum EventType { Online, Venue, TBA }
    public enum RecurrenceType { Once, Daily, Weekly, Monthly }
    public enum EventStatus { Draft, Published, Closed }
    public class Event
    {
        [Key]
        public int EventId { get; set; }

        [Required]
        [ForeignKey("Organizer")]
        public int OrganizerId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string CoverImage { get; set; } = string.Empty;

        public string? VibeVideoUrl { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public EventType EventType { get; set; }

        public string? Location { get; set; }

        [Required]
        public DateTime RegistrationDeadline { get; set; }

        [Required]
        public DateTime EventStart { get; set; }

        [Required]
        public DateTime EventEnd { get; set; }

        [Required]
        public RecurrenceType RecurrenceType { get; set; } = RecurrenceType.Once;

        [Required]
        public string Description { get; set; } = string.Empty;

        public bool IsPaidEvent { get; set; } = false;
        public decimal? Price { get; set; }
        public bool IsVerifiedByAdmin { get; set; } = false;
        public DateTime? AdminVerifiedAt { get; set; }
        public EventStatus Status { get; set; } = EventStatus.Draft;
        public bool PlatformFeePaid { get; set; } = false;
        public int? MaxAttendees { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        // Navigation and workflow fields
        public string? OrganizerEmail { get; set; } // For notifications/emails
        public string? AdminComments { get; set; } // For admin workflow
        public virtual User? Organizer { get; set; }
        public virtual ICollection<Ticket>? Tickets { get; set; }
        public virtual ICollection<Registration>? Registrations { get; set; }
        public virtual ICollection<EventOccurrence>? Occurrences { get; set; }
        public virtual ICollection<EventMedia>? Media { get; set; }
        public virtual ICollection<EventFaq>? Faqs { get; set; }
        public virtual ICollection<EventSpeaker>? Speakers { get; set; }
        public virtual ICollection<Bookmark>? Bookmarks { get; set; }
        public virtual ICollection<Notification>? Notifications { get; set; }
    }
}
