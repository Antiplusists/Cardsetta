using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dto;
using Core.Models.Results;
using Core.Models.Validation;
using Core.Repositories.Abstracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    [Produces("application/json")]
    public class UsersController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UsersController(UserManager<ApplicationUser> userManager, IUserRepository userRepository, IMapper mapper)
        {
            this.userManager = userManager;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        [HttpGet("{userId:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserResult>> GetUserById([FromRoute] Guid userId)
        {
            var user = await userRepository.FindAsync(userId.ToString());
            if (user is null)
                return NotFound();
            return Ok(mapper.Map<ApplicationUser, UserResult>(user));
        }

        [HttpGet("{userName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserResult>> GetUserByUserName([FromRoute] string userName)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrWhiteSpace(userName))
                return BadRequest();
            var user = await userRepository.FindByNameAsync(userName);
            if (user is null)
                return NotFound();
            return Ok(mapper.Map<ApplicationUser, UserResult>(user));
        }

        [HttpPost("update-username")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateUserName([Required] [OnlyLettersAndNumbers] [FromBody] string userName)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = await userManager.SetUserNameAsync(await userManager.GetUserAsync(User), userName);

            if (!result.Succeeded)
                return BadRequest();

            return NoContent();
        }

        [HttpPost("update-password")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> UpdatePassword([FromForm] UpdateUserPasswordDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var result = await userManager.ChangePasswordAsync(await userManager.GetUserAsync(User), dto.OldPassword,
                dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest();

            return NoContent();
        }
    }
}