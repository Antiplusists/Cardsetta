using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dto;
using Core.Services.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Core.Controllers
{
    [ApiController]
    [Route("/api/v1/auth")]
    public class AuthenticationController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IMapper mapper;
        private readonly ILogger logger;

        public AuthenticationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
            IMapper mapper, ILogger logger)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.logger = logger;
        }
        
        private static object CreateToken(ApplicationUser user) => new
        {
            JwtConstants.TokenType,
            AccessToken = JwtTokens.GenerateToken(user.Id, user.UserName)
        };

        [HttpPost("register")]
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
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(String.Empty, error.Description);
                }

                return UnprocessableEntity(ModelState);
            }
            
            return Ok(CreateToken(user));
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> Login([FromForm] AuthUserDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var user = await userManager.FindByNameAsync(dto.UserName);

            if (user is null)
                return BadRequest();

            var result = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);

            if (!result.Succeeded)
                return BadRequest();

            return Ok(CreateToken(user));
        }
    }
}