using System.Collections.Generic;
using System.Threading.Tasks;
using EventSphere.Application.Repositories;
using EventSphere.Domain.Entities;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _context;
        public EventRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Event?> GetEventByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Speakers)
                .Include(e => e.Occurrences)
                .FirstOrDefaultAsync(e => e.EventId == id);
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events
                .Include(e => e.Speakers)
                .Include(e => e.Occurrences)
                .ToListAsync();
        }

        public async Task AddEventAsync(Event ev)
        {
            _context.Events.Add(ev);
            // Explicitly add EventMedia to context to guarantee persistence
            if (ev.Media != null)
            {
                foreach (var media in ev.Media)
                {
                    _context.EventMedias.Add(media);
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEventAsync(Event ev)
        {
            // Explicitly update occurrences
            if (ev.Occurrences != null)
            {
                // Remove existing occurrences for this event
                var existingOccurrences = _context.EventOccurrences.Where(o => o.EventId == ev.EventId);
                _context.EventOccurrences.RemoveRange(existingOccurrences);
                // Add new occurrences
                foreach (var occ in ev.Occurrences)
                {
                    occ.EventId = ev.EventId;
                    _context.EventOccurrences.Add(occ);
                }
            }
            _context.Events.Update(ev);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEventAsync(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev != null)
            {
                _context.Events.Remove(ev);
                await _context.SaveChangesAsync();
            }
        }
    }
}
