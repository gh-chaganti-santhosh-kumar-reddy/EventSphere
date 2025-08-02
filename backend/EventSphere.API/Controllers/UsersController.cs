using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using EventSphere.Application.Dtos.Auth;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFileService _fileService;

        public UsersController(IUserService userService, IFileService fileService)
        {
            _userService = userService;
            _fileService = fileService;
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var dto = await _userService.GetUserDetailsByIdAsync(id);
            if (dto == null)
                return NotFound();
            return Ok(dto);
        }
        // PATCH: api/users/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserProfileDto dto)
        {
            string? imagePath = null;
            if (dto.ProfileImage != null && dto.ProfileImage.Length > 0)
            {
                imagePath = await _fileService.SaveUserProfileImageAsync(id, dto.ProfileImage);
            }
            var result = await _userService.UpdateUserDetailsWithImageAsync(id, dto.Name, dto.Email, dto.PhoneNumber, imagePath);
            if (!result)
                return NotFound();
            // Option 1: Return updated user data (recommended)
            var updatedUserDetails = await _userService.GetUserDetailsByIdAsync(id);
            return Ok(updatedUserDetails);
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}
