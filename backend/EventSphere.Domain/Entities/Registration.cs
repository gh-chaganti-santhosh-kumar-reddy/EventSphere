using System;
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventSphere.Domain.Entities
{
    public enum RegistrationStatus { Registered, Cancelled, Attended }
    public enum PaymentStatus { Paid, Pending, Free }
    public class Registration
    {
        [Key]
        public int RegistrationId { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [ForeignKey("Event")]
        public int EventId { get; set; }

        [Required]
        [ForeignKey("EventOccurrence")]
        public int OccurrenceId { get; set; }

        [Required]
        [ForeignKey("Ticket")]
        public int TicketId { get; set; }

        [Required]
        public RegistrationStatus Status { get; set; } = RegistrationStatus.Registered;

        [Required]
        public PaymentStatus PaymentStatus { get; set; }

        [Required]
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        public string? QrCode { get; set; }
        public DateTime? CheckinTime { get; set; }
        public bool EmailReminderSent { get; set; } = false;

        [ForeignKey("Payment")]
        public int? PaymentId { get; set; }

        // Navigation and workflow fields
        public string? UserEmail { get; set; }
        public string? EventTitle { get; set; }
        public string? TicketType { get; set; }
        public string? AdminNotes { get; set; }

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Event? Event { get; set; }
        public virtual EventOccurrence? EventOccurrence { get; set; }
        public virtual Ticket? Ticket { get; set; }
        public virtual Payment? Payment { get; set; }
    }
}
