using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        // TODO: Inject your dashboard service here (IDashboardService) and use it for data access

        [HttpGet]
        public IActionResult GetAll()
        {
            // TODO: Return all dashboard data
            return Ok();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            // TODO: Return dashboard data by id
            return Ok();
        }

        [HttpPost]
        public IActionResult Create([FromBody] object dashboardData)
        {
            // TODO: Create new dashboard data
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] object dashboardData)
        {
            // TODO: Update dashboard data
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // TODO: Delete dashboard data
            return Ok();
        }
    }
}
