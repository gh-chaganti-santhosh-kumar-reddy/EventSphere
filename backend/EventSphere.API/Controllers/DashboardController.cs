using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly EventSphere.Application.Interfaces.IDashboardService _dashboardService;
        public DashboardController(EventSphere.Application.Interfaces.IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _dashboardService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
            => await SingleOrNotFound(() => _dashboardService.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EventSphere.Application.Dtos.DashboardDto dashboardData)
            => await CreatedOrBadRequest(dashboardData);

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventSphere.Application.Dtos.DashboardDto dashboardData)
            => await SingleOrNotFound(() => _dashboardService.UpdateAsync(id, dashboardData));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _dashboardService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        // Helper for single-entity endpoints
        private async Task<IActionResult> SingleOrNotFound<T>(Func<Task<T?>> getter) where T : class
        {
            var result = await getter();
            return result == null ? NotFound() : Ok(result);
        }

        // Helper for CreatedAtAction
        private async Task<IActionResult> CreatedOrBadRequest(EventSphere.Application.Dtos.DashboardDto dto)
        {
            var created = await _dashboardService.CreateAsync(dto);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}
