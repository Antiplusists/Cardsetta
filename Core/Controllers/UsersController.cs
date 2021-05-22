using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dto;
using Core.Models.Result;
using Core.Models.Validation;
using Core.Repositories.Abstracts;
using Core.Services.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;

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

        [HttpPost("update-avatar")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAvatar(
            [Required] [Models.Validation.FileExtensions("jpeg", "jpg", "png")]
            IFormFile image)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await userManager.GetUserAsync(User);

            //TODO: какое-то изменение картинки

            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
                throw new AggregateException();

            return NoContent();
        }
    }
}