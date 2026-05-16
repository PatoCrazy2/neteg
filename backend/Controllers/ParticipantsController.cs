using backend.Services;
using Microsoft.AspNetCore.Mvc;
using shared.DTOs.Participants;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParticipantsController : ControllerBase
{
    private readonly IParticipantService _participantService;

    public ParticipantsController(IParticipantService participantService)
    {
        _participantService = participantService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterParticipantRequest request)
    {
        try
        {
            var result = await _participantService.RegisterAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetByEventId(Guid eventId)
    {
        var participants = await _participantService.GetByEventIdAsync(eventId);
        return Ok(participants);
    }
}
