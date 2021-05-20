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
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IMapper mapper;
        private readonly ILogger logger;

        public UsersController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
            IMapper mapper, ILogger logger)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.logger = logger;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> Register([FromForm] CreationUserDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var user = mapper.Map<CreationUserDto, ApplicationUser>(dto);
            var result = await userManager.CreateAsync(user, dto.Password);


            if (!result.Succeeded)
            {
                logger.Error("Errors with register {0}", string.Join(", ", JsonSerializer.Serialize(result.Errors)));
                throw new AggregateException();
            }

            //Как я понимаю тут кукисы сетятся с токеном
            await signInManager.SignInAsync(user, false);
            return NoContent();
        }

        [HttpPost("me")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> GetMe()
        {
            return Ok(JwtTokens.GenerateEncoded(Guid.Parse("613f4fa0-7cb0-45c7-947d-94f6468f4b69"),
               "someemail@asd.ru"));
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> Login([FromForm] AuthUserDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var result = await signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);

            if (!result.Succeeded)
                return BadRequest();

            return NoContent();
        }

        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }

        [HttpGet("{userId:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserResult>> GetUserById([FromRoute] Guid userId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
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
            var user = await userManager.FindByNameAsync(userName);
            if (user is null)
                return NotFound();
            return Ok(mapper.Map<ApplicationUser, UserResult>(user));
        }

        [HttpPost("update-username")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateUserName([Required] [OnlyLettersAndNumbers] string userName)
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