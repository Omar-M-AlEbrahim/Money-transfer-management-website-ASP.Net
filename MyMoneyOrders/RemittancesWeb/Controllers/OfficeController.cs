using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyMoneyOrdersDoumain.model;
using MyMoneyOrdersInfrastructure.Repository;
using RemittancesWeb.model;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MyMoneyOrdersWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfficeController : ControllerBase
    {
        private readonly OfficeRepository _officeRepository;
        private readonly IMapper _mapper;
        public OfficeController(OfficeRepository officeRepository, IMapper mapper, IRepository<User> userRepository)
        {
            _officeRepository = officeRepository;
            _mapper = mapper;
        }

        [HttpGet("offices")]
        [Authorize]
        public async Task<IActionResult> GetAllOffices()
        {
            try
            {
                var offices = _officeRepository.GetAll().ToList();//للادمن
                if (offices == null || offices.Count == 0)
                    return NotFound("No offices found.");

                return Ok(offices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("{officeId}")]
        [Authorize]
        public async Task<IActionResult> GetOfficeById(Guid officeId)//للادمن
        {
            try
            {
                var office =await _officeRepository.GetById(officeId);
                if (office == null)
                    return NotFound("Office not found.");

                return Ok(office);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddOffice(AddOfficeDTOmodel officeDTO)//ادمن 
        {
            try
            {
                var office = await _officeRepository.AddOfficeAsync(officeDTO);
                return Ok(office);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPut("update/{officeId}")]
        [Authorize]
        public async Task<IActionResult> UpdateOffice(Guid officeId, [FromBody] UpdateOfficeDTOmodel officeDto)
        {
            try
            {
                var updatedOffice = await _officeRepository.UpdateOfficeAsync(officeId, officeDto);
                if (updatedOffice == null)
                {
                    return NotFound(new { message = "Office not found" });
                }
                return Ok(updatedOffice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("transfers/{officeId}")]
        [Authorize]
        public async Task<IActionResult> GetOfficeTransfers(Guid officeId)
        {
            try
            {
                var transfers = await _officeRepository.GetOfficeTransfersAsync(officeId);
                if (transfers == null || transfers.Count == 0)
                {
                    return BadRequest("No transfers found for this office.");
                }

                return Ok(transfers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetOfficesWithTransfers()
        {
            try
            {
                var offices = await _officeRepository.GetOfficesWithTransfersAsync();
                if (offices == null || offices.Count == 0)
                {
                    return NotFound("No offices found.");
                }

                return Ok(offices);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
