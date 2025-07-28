using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventSphere.Domain.Entities
{
    public enum MediaType { Image, Video }
    public class EventMedia
    {
        [Key]
        public int MediaId { get; set; }

        [Required]
        [ForeignKey("Event")]
        public int EventId { get; set; }

        [Required]
        public string MediaUrl { get; set; } = string.Empty;

        [Required]
        public MediaType MediaType { get; set; }

        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation and workflow fields
        public string? EventTitle { get; set; }

        // Navigation property
        public virtual Event? Event { get; set; }
    }
}
