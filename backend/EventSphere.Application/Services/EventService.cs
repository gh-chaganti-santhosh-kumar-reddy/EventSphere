using backend.Interfaces;
using EventSphere.Domain.Entities;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;
        public EventService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<Event> CreateEventAsync(Event evt, IFormFile? coverImage, IFormFile? vibeVideo, List<EventSphere.Application.Dtos.Events.MediaDto>? mediaDtos)
        {
            // Save files if provided
            if (coverImage != null)
            {
                evt.CoverImage = await SaveFile(coverImage, "covers");
            }
            if (vibeVideo != null)
            {
                evt.VibeVideoUrl = await SaveFile(vibeVideo, "videos");
            }

            // Save event first to get EventId
            _context.Events.Add(evt);
            await _context.SaveChangesAsync();


            // Debug: Log SpeakerId values
            if (evt.Speakers != null && evt.Speakers.Count > 0)

            {
                foreach (var speaker in evt.Speakers)
                {
                    // Ensure SpeakerId is not set so SQL Server generates it
                    speaker.SpeakerId = 0;
                    Console.WriteLine($"[DEBUG] SpeakerId before save: {speaker.SpeakerId}");
                    speaker.EventId = evt.EventId;
                    _context.Set<EventSpeaker>().Add(speaker);
                }
            }

            // Debug: Log FaqId values
            if (evt.Faqs != null && evt.Faqs.Count > 0)

            {
                foreach (var faq in evt.Faqs)
                {
                    // Ensure FaqId is not set so SQL Server generates it
                    faq.FaqId = 0;
                    Console.WriteLine($"[DEBUG] FaqId before save: {faq.FaqId}");
                    faq.EventId = evt.EventId;
                    _context.Set<EventFaq>().Add(faq);
                }
            }

            // Save media if any
            if (evt.Media != null && evt.Media.Count > 0)
            {
                var mediaList = evt.Media.ToList();
                for (int i = 0; i < mediaList.Count; i++)
                {
                    var media = mediaList[i];
                    // Ensure MediaId is not set so SQL Server generates it
                    media.MediaId = 0;
                    media.EventId = evt.EventId;
                    if (mediaDtos != null && i < mediaDtos.Count && mediaDtos[i].MediaFile != null)
                    {
                        var file = mediaDtos[i].MediaFile!;
                        var folder = media.MediaType == MediaType.Image ? "media-images" : "media-videos";
                        media.MediaUrl = await SaveFile(file, folder);
                    }
                    _context.Set<EventMedia>().Add(media);
                }
            }

            // Save occurrences if any
            if (evt.Occurrences != null && evt.Occurrences.Count > 0)
            {
                foreach (var occ in evt.Occurrences)
                {
                    // Ensure OccurrenceId is not set so SQL Server generates it
                    occ.OccurrenceId = 0;
                    occ.EventId = evt.EventId;
                    _context.Set<EventOccurrence>().Add(occ);
                }
            }

            await _context.SaveChangesAsync();
            return evt;
        }

        // Helper to save file and return URL
        private async Task<string> SaveFile(IFormFile file, string folder)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
            Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploads, fileName);
            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                System.Console.WriteLine($"[SaveFile] Saved file to: {filePath}");
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"[SaveFile] Error saving file to: {filePath} - {ex.Message}");
                throw;
            }
            // Return relative URL
            return $"/uploads/{folder}/{fileName}";
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<Event?> GetEventByIdAsync(int id)
        {
            return await _context.Events.FindAsync(id);
        }

        public async Task<Event?> UpdateEventAsync(int id, Event evt)
        {
            var existing = await _context.Events.FindAsync(id);
            if (existing == null) return null;
            _context.Entry(existing).CurrentValues.SetValues(evt);
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            var evt = await _context.Events.FindAsync(id);
            if (evt == null) return false;
            _context.Events.Remove(evt);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
