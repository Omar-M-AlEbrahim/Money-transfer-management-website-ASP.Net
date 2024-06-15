using Microsoft.Extensions.Configuration; // بتسمحلنا نوصل على الاعدادات
using Microsoft.IdentityModel.Tokens; 
using MyMoneyOrdersDoumain.model; 
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims; 
using System.Text; 

namespace MyMoneyOrdersInfrastructure.Repository
{
    public class TokenServices : ITokenServices 
    {
        private readonly IConfiguration configuration;
        private readonly SymmetricSecurityKey key; 

        public TokenServices(IConfiguration configuration) 
        {
            this.configuration = configuration; 
            key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Token:Key"])); 
        }
        public string CreateToken(User user) // دالة لإنشاء التوكن
        {
            var claims = new List<Claim>() // قائمة لتخزين 
            {

                  new Claim("RoleId", user.RoleId.ToString()), //  برقم الدور
                  new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), //  بمعرف المستخدم
                  new Claim(ClaimTypes.Name, user.UserName), //  باسم المستخدم
            };
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature); 
            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims), 
                Expires = DateTime.Now.AddHours(5), // صلاحية التوكن 
                Issuer = configuration["Token:Issuer"], // منشئ التوكن
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler(); 
            var token = tokenHandler.CreateToken(tokenDescriptor); // إنشاء التوكن
            return tokenHandler.WriteToken(token); // ارجاع التوكن
        }
    }
}
