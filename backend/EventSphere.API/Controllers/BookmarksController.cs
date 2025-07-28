using Microsoft.AspNetCore.Mvc;
using EventSphere.Domain.Entities;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookmarksController : ControllerBase
    {
        // TODO: Inject your bookmark service here (IBookmarkService) and use it for data access

        [HttpGet]
        public IActionResult GetAll()
        {
            // TODO: Return all bookmarks
            return Ok();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            // TODO: Return bookmark by id
            return Ok();
        }

        [HttpPost]
        public IActionResult Create([FromBody] Bookmark bookmark)
        {
            // TODO: Create new bookmark
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Bookmark bookmark)
        {
            // TODO: Update bookmark
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // TODO: Delete bookmark
            return Ok();
        }
    }
}
