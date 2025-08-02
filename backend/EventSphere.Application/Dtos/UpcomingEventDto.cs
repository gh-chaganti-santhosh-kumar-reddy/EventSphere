using System;
using EventSphere.Domain.Enums;

namespace EventSphere.Application.Dtos
{
    public class UpcomingEventDto
    {
        public string Title { get; set; } = string.Empty;
        public string CoverImage { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public EventType EventType { get; set; }
        public string? Location { get; set; }
        public DateTime RegistrationDeadline { get; set; }
        public DateTime EventStart { get; set; }
        public DateTime EventEnd { get; set; }
        public decimal? Price { get; set; }
    }
}
