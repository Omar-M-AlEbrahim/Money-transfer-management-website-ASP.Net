using AutoMapper;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyMoneyOrdersDoumain.model;
using MyMoneyOrdersInfrastructure.Repository;
using RemittancesWeb.model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace RemittancesWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository; // عملو لحتى نوصل لبيانات المستخدمين
        private readonly IMapper _mapper; // لتحويل بيانات المستخدمين، ضروري لعمل الـ Mapping
        private readonly UserManager<User> _userManager; // عملو لتدبير المستخدمين، عم يعملو لواحد قدرات كتيرة
        private readonly RoleRepository _rolerepository; // عملو لنوصل لبيانات الأدوار بالتطبيق
        private readonly ITokenServices tokenServices;

        public UserController(UserRepository userRepository,
            IMapper mapper,
            UserManager<User> userManager,
            RoleRepository rolerepository,
            ITokenServices tokenServices)

        {
            _userRepository = userRepository;
            _mapper = mapper;
            _userManager = userManager;
            _rolerepository = rolerepository;
            this.tokenServices = tokenServices;
        }

        [HttpGet("roleuser")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roleUser = await _rolerepository.Find(r => r.Name == "user");
            return Ok(roleUser);
        }


        [HttpGet("users")]
      
        public IActionResult GetAllUser()
        {
            var roleuser = _userRepository.GetAll().ToList();
            return Ok(roleuser);
        }



        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
       {
            var user =await _userRepository.GetById(userId);
            if (user == null)
                return NotFound();

            var role =await _rolerepository.GetById(user.RoleId.Value);
            var userDataWithRole = new
            {
                User = user,
                Role = role
            };

            return Ok(userDataWithRole);
        }


        [HttpPost("add")]
       // [Authorize]
        public async Task<IActionResult> AddUser(AddUserDTOmodel userDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExist = await _userManager.FindByEmailAsync(userDTO.Email);
            if (userExist != null)
            {
                return BadRequest("User with this email already exists.");
            }

            var userDTOToReturn = _mapper.Map<User>(userDTO);

            var result = await _userManager.CreateAsync(userDTOToReturn, userDTO.UserPassword );
            if (result.Succeeded)
            {
                await _userRepository.Savechang();
                return Ok(result);
            }
            else
            {
                return StatusCode(500, "Failed to create user.");
            }
        }

        [HttpDelete("delete/{userId}")]
      //  [Authorize]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            var user = await _userRepository.GetById(userId);
            if (user == null)
                return NotFound("User not found.");
            var result = await _userRepository.DeleteUser(user);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPut("update/{userId}")]
        // [//Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUser(Guid userId, AddUserDTOmodel userDTO)
        {
            var user = await _userRepository.UpdateUser(userId, userDTO);
            if (user == null)
                return NotFound();

            var userDTOToReturn = _mapper.Map<User>(user);
            return Ok(userDTOToReturn);
        }

        [HttpPut("activate/{userId}")]
      //  [Authorize]
        public async Task<IActionResult> ActivateUser(Guid userId)
        {
            var user = await _userRepository.GetById(userId);
            if (user == null)
                return NotFound("User not found.");

            var activationResult = await _userRepository.ActivateUser(user);
            if (activationResult)
            {
                return Ok(activationResult);
            }
            else
            {
                return BadRequest("Failed to activate user.");
            }
        }
        [HttpPost("login")]
   
        public async Task<IActionResult> Login(LoginViewModel loginModel)
        {
            // التحقق من وجود المستخدم في قاعدة البيانات
            var user = await _userManager.FindByNameAsync(loginModel.UserName);
            if (user == null)
            {
                return BadRequest("Invalid username or password.");
            }

            // التحقق من صحة كلمة المرور
            var result = await _userManager.CheckPasswordAsync(user, loginModel.Password);
            if (!result)
            {
                return BadRequest("Invalid username or password.");
            }

            // الحصول على أدوار المستخدم
            var roles = await _userManager.GetRolesAsync(user);

    
            return Ok(new { Token = tokenServices.CreateToken(user), Roles = roles, User = user });
        }
    }
}