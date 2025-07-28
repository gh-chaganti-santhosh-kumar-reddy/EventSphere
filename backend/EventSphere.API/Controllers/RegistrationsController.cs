using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        // TODO: Inject your registration service here (IRegistrationService) and use it for data access

        [HttpGet]
        public IActionResult GetAll()
        {
            // TODO: Return all registrations
            return Ok();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            // TODO: Return registration by id
            return Ok();
        }

        [HttpPost]
        public IActionResult Create([FromBody] Registration registration)
        {
            // TODO: Create new registration
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Registration registration)
        {
            // TODO: Update registration
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // TODO: Delete registration
            return Ok();
        }
    }
}
