using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMoneyOrdersDoumain.model;
using MyMoneyOrdersInfrastructure;
using MyMoneyOrdersInfrastructure.Repository;
using RemittancesWeb.model;
using System;
using System.Threading.Tasks;

namespace MyMoneyOrdersWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransferController : ControllerBase
    {
        private readonly TansferReposotpry _transferRepository;


        public TransferController(TansferReposotpry transferRepository)
        {
            _transferRepository = transferRepository;

        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAllTransfersWithOffices()
        {
            try
            {
                var transfersWithOffices = await _transferRepository.GetAllTransfersWithOffices().ToListAsync();
                return Ok(transfersWithOffices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateTransfer(SendTransferModel transferModel)
        {
            try
            {
                var newTransfer = await _transferRepository.CreateTransferAsync(transferModel);
                if (newTransfer == null)
                {
                    return BadRequest("Failed to create transfer.");
                }

                // Return a successful response with the transfer code
                return Ok(new { TransferCode = newTransfer.TransferCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("receive")]
        [Authorize]
        public async Task<IActionResult> ReceiveTransfer(ReceiveTransferModel receiveModel)
        {
            try
            {
                if (receiveModel == null || receiveModel.TransferId == Guid.Empty || string.IsNullOrEmpty(receiveModel.TransferCode))
                {
                    return BadRequest("The receipt data is invalid.");
                }

                var receivedTransfer = await _transferRepository.ReceiveTransferAsync(receiveModel.TransferId, receiveModel.TransferCode);
                if (receivedTransfer == null)
                {
                    return BadRequest("Failed to receive the transfer.");
                }

                return Ok(new { message = "The transfer was received successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        [HttpDelete("delete/{transferId}")]
        [Authorize]
        public async Task<IActionResult> DeleteTransfer(Guid transferId)
        {
            try
            {
                var isDeleted = await _transferRepository.DeleteTransferAsync(transferId);

                if (!isDeleted)
                {
                    return NotFound(new { message = "Remittance not available or already received." });
                }

                return Ok(new { message = "The transfer has been deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }




        [HttpGet("getTransfersBySender/{senderOfficeId}")]
        [Authorize]
        public async Task<IActionResult> GetTransfersBySender(Guid senderOfficeId)
        {
            try
            {
                var transfers = await _transferRepository.GetTransfersBySenderId(senderOfficeId).ToListAsync();
                return Ok(transfers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }




        [HttpGet("receivedTransfers/{officeId}")]
        [Authorize]

        public async Task<IActionResult> GetReceivedTransfers(Guid officeId)
        {
            try
            {
                var transfers = await _transferRepository.GetReceivedTransfersByOfficeId(officeId).ToListAsync();
                return Ok(transfers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        [HttpGet("receivedTransfersEqualTrue/{officeId}")]
        public async Task<IActionResult> GetReceivedTransfersAnsStutsEqualTrue(Guid officeId)
        {
            try
            {
                var transfers = await _transferRepository.GetReceivedTransfersByOfficeIdAndstutusEqalTrue(officeId).ToListAsync();
                return Ok(transfers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        [HttpGet("transferCountPerDayLastWeek")]
        public async Task<IActionResult> GetTransferCountPerDayLastWeek()
        {
            try
            {
                var transferCountPerDay = await _transferRepository.GetTransferCountPerDayLastWeek().ToListAsync();
                if (transferCountPerDay == null || !transferCountPerDay.Any())
                {
                    return NotFound("No transfer data found for the last 7 days.");
                }
                return Ok(transferCountPerDay);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}
