using System.Collections.Generic;
using System.Threading.Tasks;
using EventSphere.Domain.Entities;

namespace EventSphere.Application.Repositories
{
    public interface IEventRepository
    {
        Task<Event?> GetEventByIdAsync(int id);
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task AddEventAsync(Event ev);
        Task UpdateEventAsync(Event ev);
        Task DeleteEventAsync(int id);
        // Add more event-related methods as needed
    }
}
