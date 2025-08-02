using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;
using EventSphere.Application.Dtos.Events;
using EventSphere.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class EventsController : ControllerBase
    {
        private readonly backend.Interfaces.IEventService _eventService;

        [HttpGet("upcoming")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUpcomingEvents()
        {
            var events = await _eventService.GetUpcomingEventsAsync();
            return Ok(new { success = true, data = events });
        }

        public EventsController(backend.Interfaces.IEventService eventService)
        {
            _eventService = eventService;
        }



        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventService.GetAllEventsAsync();
            var eventDtos = events.Select(e => EventSphere.Application.Mappers.EventMapper.ToDto(e)).ToList();
            return Ok(new { success = true, data = eventDtos });
        }




        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var evt = await _eventService.GetEventByIdAsync(id);
            if (evt == null)
                return NotFound(new { success = false, message = "Event not found" });
            var dto = EventSphere.Application.Mappers.EventMapper.ToDto(evt);
            return Ok(new { success = true, data = dto });
        }



        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto)
        {
            if (dto == null)
                return BadRequest(new { success = false, message = "Invalid event data" });

            // Use AuthHelper for organizerId extraction
            var organizerId = EventSphere.Application.Helpers.AuthHelper.GetOrganizerIdFromClaims(HttpContext);
            if (organizerId == null)
                return Unauthorized(new { success = false, message = "User not authenticated or invalid user id in token" });

            // Pass all files and DTO to the service for processing (service will handle form reading and DTO population)
            var evt = await _eventService.MapAndCreateEventWithFilesAsync(dto, organizerId.Value, Request);

            // Return all relevant event details for frontend validation and display
            return Ok(new {
                coverImageUrl = evt.CoverImage,
                vibeVideoUrl = evt.VibeVideoUrl,
                eventId = evt.EventId,
                title = evt.Title,
                category = evt.Category,
                description = evt.Description,
                organizerName = evt.OrganizerName,
                eventLink = evt.EventLink,
                recurrenceType = evt.RecurrenceType,
                location = evt.Location,
                occurrences = evt.Occurrences?.Select(o => new {
                    o.OccurrenceId,
                    o.StartTime,
                    o.EndTime,
                    o.EventTitle,
                    o.IsCancelled
                }).ToList()
            });
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEventDto evt)
        {
            if (evt == null)
                return BadRequest(new { success = false, message = "Invalid event data" });
            var updated = await _eventService.UpdateEventAsync(id, evt);
            if (updated == null)
                return NotFound(new { success = false, message = "Event not found" });
            return Ok(new { success = true, data = updated });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _eventService.DeleteEventAsync(id);
            if (!deleted)
                return NotFound(new { success = false, message = "Event not found" });
            return Ok(new { success = true, message = "Event deleted successfully" });
        }
    }
}
