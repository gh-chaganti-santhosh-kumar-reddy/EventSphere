using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;
using EventSphere.Application.Dtos.Events;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class EventsController : ControllerBase
    {
        private readonly backend.Interfaces.IEventService _eventService;

        public EventsController(backend.Interfaces.IEventService eventService)
        {
            _eventService = eventService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var events = await _eventService.GetAllEventsAsync();
                return Ok(new { success = true, data = events });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var evt = await _eventService.GetEventByIdAsync(id);
                if (evt == null)
                    return NotFound(new { success = false, message = "Event not found" });
                return Ok(new { success = true, data = evt });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }



        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto)
        {
            // Do NOT set identity properties (FaqId, SpeakerId, etc) at all. Let SQL Server handle them.
            // Manually parse JSON arrays from form if present as strings
            var form = Request.HasFormContentType ? await Request.ReadFormAsync() : null;
            var jsonSettings = new Newtonsoft.Json.JsonSerializerSettings { MissingMemberHandling = Newtonsoft.Json.MissingMemberHandling.Ignore };
            if (form != null)
            {
                if (form.TryGetValue("Speakers", out var speakersVal) && speakersVal.Count > 0 && !string.IsNullOrWhiteSpace(speakersVal[0]))
                {
                    try { dto.Speakers = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EventSphere.Application.Dtos.Events.SpeakerDto>>(speakersVal[0], jsonSettings); } catch { }
                }
                if (form.TryGetValue("Faqs", out var faqsVal) && faqsVal.Count > 0 && !string.IsNullOrWhiteSpace(faqsVal[0]))
                {
                    try { dto.Faqs = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EventSphere.Application.Dtos.Events.FaqDto>>(faqsVal[0], jsonSettings); } catch { }
                }
                if (form.TryGetValue("Media", out var mediaVal) && mediaVal.Count > 0 && !string.IsNullOrWhiteSpace(mediaVal[0]))
                {
                    try { dto.Media = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EventSphere.Application.Dtos.Events.MediaDto>>(mediaVal[0], jsonSettings); } catch { }
                }
                if (form.TryGetValue("Occurrences", out var occVal) && occVal.Count > 0 && !string.IsNullOrWhiteSpace(occVal[0]))
                {
                    try { dto.Occurrences = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EventSphere.Application.Dtos.Events.OccurrenceDto>>(occVal[0], jsonSettings); } catch { }
                }
            }
            if (dto == null)
                return BadRequest(new { success = false, message = "Invalid event data" });

            // Debug logging for received data
            System.Console.WriteLine($"Speakers: {dto.Speakers?.Count ?? 0}");
            if (dto.Speakers != null)
            {
                foreach (var s in dto.Speakers)
                {
                    System.Console.WriteLine($"  Speaker: {s.Name}, Bio: {s.Bio}, PhotoUrl: {s.PhotoUrl}, SocialLinks: {s.SocialLinks}");
                }
            }
            System.Console.WriteLine($"Faqs: {dto.Faqs?.Count ?? 0}");
            if (dto.Faqs != null)
            {
                foreach (var f in dto.Faqs)
                {
                    System.Console.WriteLine($"  Faq: {f.Question} -> {f.Answer}");
                }
            }
            System.Console.WriteLine($"Media: {dto.Media?.Count ?? 0}");
            if (dto.Media != null)
            {
                foreach (var m in dto.Media)
                {
                    System.Console.WriteLine($"  Media: {m.MediaUrl}, Type: {m.MediaType}, Desc: {m.Description}");
                }
            }
            System.Console.WriteLine($"Occurrences: {dto.Occurrences?.Count ?? 0}");
            if (dto.Occurrences != null)
            {
                foreach (var o in dto.Occurrences)
                {
                    System.Console.WriteLine($"  Occurrence: {o.StartTime} - {o.EndTime}, Title: {o.EventTitle}");
                }
            }

            // Get user id from claims (assumes authentication middleware is in use)
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { success = false, message = "User not authenticated" });

            int organizerId;
            if (!int.TryParse(userIdClaim, out organizerId))
                return Unauthorized(new { success = false, message = "Invalid user id in token" });

            var evt = new Event
            {
                Title = dto.Title ?? string.Empty,
                Category = dto.Category ?? string.Empty,
                Description = dto.Description ?? string.Empty,
                RegistrationDeadline = dto.RegistrationDeadline,
                EventStart = dto.EventStart,
                EventEnd = dto.EventEnd,
                OrganizerId = organizerId, // Force to authenticated user
                IsPaidEvent = dto.IsPaidEvent,
                Price = dto.Price,
                MaxAttendees = dto.MaxAttendees,
                OrganizerEmail = dto.OrganizerEmail,
                // CoverImage and VibeVideoUrl will be set by service
                Speakers = dto.Speakers?.Select(s => new EventSpeaker {
                    Name = s.Name,
                    Bio = s.Bio,
                    PhotoUrl = s.PhotoUrl,
                    SocialLinks = s.SocialLinks
                }).ToList(),
                Faqs = dto.Faqs?.Select(f => new EventFaq {
                    Question = f.Question,
                    Answer = f.Answer
                }).ToList(),
                Media = dto.Media?.Select(m => new EventMedia {
                    MediaUrl = m.MediaUrl,
                    MediaType = Enum.TryParse<MediaType>(m.MediaType, out var mt) ? mt : MediaType.Image,
                    Description = m.Description
                }).ToList(),
                Occurrences = dto.Occurrences?.Select(o => new EventOccurrence {
                    StartTime = o.StartTime,
                    EndTime = o.EndTime,
                    EventTitle = o.EventTitle
                }).ToList()
            };

            try
            {
                var created = await _eventService.CreateEventAsync(evt, dto.CoverImage, dto.VibeVideo, dto.Media);
                return Ok(new { coverImageUrl = created.CoverImage, vibeVideoUrl = created.VibeVideoUrl, eventId = created.EventId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // Helper to save file and return URL
        private async Task<string> SaveFile(IFormFile file, string folder)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
            Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploads, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            // Return relative URL
            return $"/uploads/{folder}/{fileName}";
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event evt)
        {
            if (evt == null)
                return BadRequest(new { success = false, message = "Invalid event data" });
            try
            {
                var updated = await _eventService.UpdateEventAsync(id, evt);
                if (updated == null)
                    return NotFound(new { success = false, message = "Event not found" });
                return Ok(new { success = true, data = updated });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _eventService.DeleteEventAsync(id);
                if (!deleted)
                    return NotFound(new { success = false, message = "Event not found" });
                return Ok(new { success = true, message = "Event deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
