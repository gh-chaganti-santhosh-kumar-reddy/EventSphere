using EventSphere.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IEventService
    {
        Task<Event> CreateEventAsync(Event evt, Microsoft.AspNetCore.Http.IFormFile? coverImage, Microsoft.AspNetCore.Http.IFormFile? vibeVideo, List<EventSphere.Application.Dtos.Events.MediaDto>? mediaDtos);
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(int id);
        Task<Event?> UpdateEventAsync(int id, Event evt);
        Task<bool> DeleteEventAsync(int id);
    }
}
