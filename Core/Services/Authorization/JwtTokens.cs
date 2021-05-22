using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Core.Services.Authorization
{
    public static class JwtTokens
    {
        public static SymmetricSecurityKey SigningKey =>
            new(Encoding.ASCII.GetBytes("Ne!0_0!vzlomayesh!^_^!nikogda!"));

        public static string GenerateToken(string id, string name)
        {
            var claims = new Claim[]
            {
                new(JwtRegisteredClaimNames.Sub, id),
                new(JwtRegisteredClaimNames.UniqueName, name),
            };

            var jwt = new JwtSecurityToken(
                issuer:"Cardsetta",
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }
    }
}