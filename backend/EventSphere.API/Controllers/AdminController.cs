using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        // TODO: Inject your admin service here (IAdminService) and use it for data access

        [HttpGet]
        public IActionResult GetAll()
        {
            // TODO: Return all admin-related data
            return Ok();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            // TODO: Return admin data by id
            return Ok();
        }

        [HttpPost]
        public IActionResult Create([FromBody] object adminData)
        {
            // TODO: Create new admin data
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] object adminData)
        {
            // TODO: Update admin data
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // TODO: Delete admin data
            return Ok();
        }
    }
}
