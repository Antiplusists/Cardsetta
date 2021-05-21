using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IdentityModel;
using Microsoft.IdentityModel.Tokens;

namespace Core.Services.Authorization
{
    public class JwtTokens
    {
        public static SymmetricSecurityKey SigningKey =>
            new(Encoding.ASCII.GetBytes("Ne!0_0!vzlomayesh!^_^!nikogda!"));

        public const int ExpireTimeInMinutes = 180; 
        
        public static string GenerateEncoded(Guid id, string name)
        {
            var claims = new Claim[]
            {
                new(JwtRegisteredClaimNames.Sub, id.ToString()),
                new(JwtRegisteredClaimNames.Email, name),
            };

            var jwt = new JwtSecurityToken(
                issuer:"Cardsetta",
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(ExpireTimeInMinutes),
                signingCredentials: new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }
    }
}