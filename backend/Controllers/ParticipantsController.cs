using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shared.DTOs.Participants;
using shared.DTOs;
using System.Security.Claims;

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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var participant = await _participantService.GetByIdAsync(id);
        if (participant == null) return NotFound();
        return Ok(participant);
    }

    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetByEventId(Guid eventId)
    {
        var participants = await _participantService.GetByEventIdAsync(eventId);
        return Ok(participants);
    }

    [HttpGet("event/{eventId}/me")]
    [Authorize]
    public async Task<IActionResult> GetMyParticipation(Guid eventId)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var participant = await _participantService.GetUserParticipationAsync(eventId, userId);
        
        // If not found, it's not necessarily an error, just return a 204 No Content or null object.
        if (participant == null) return NoContent();
        
        return Ok(participant);
    }

    [HttpPost("verify-ticket")]
    public async Task<IActionResult> VerifyTicket([FromBody] TicketQrPayload request)
    {
        try
        {
            var result = await _participantService.VerifyTicketAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
