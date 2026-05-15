using System.Security.Claims;
using backend.DTOs.Events;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEventRequest request)
    {
        var userId = GetUserId();
        var result = await _eventService.CreateEventAsync(request, userId);
        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyEvents()
    {
        var userId = GetUserId();
        var events = await _eventService.GetUserEventsAsync(userId);
        return Ok(events);
    }

    [HttpGet("participating")]
    public async Task<IActionResult> GetParticipatingEvents()
    {
        var userId = GetUserId();
        var events = await _eventService.GetParticipatingEventsAsync(userId);
        return Ok(events);
    }

    [HttpPost("{id}/cover")]
    public async Task<IActionResult> UploadCover(Guid id, IFormFile file)
    {
        var userId = GetUserId();
        var imageUrl = await _eventService.UploadCoverImageAsync(id, file, userId);
        return Ok(new { imageUrl });
    }

    [AllowAnonymous]
    [HttpGet("{id}/public")]
    public async Task<IActionResult> GetPublicEvent(Guid id)
    {
        var eventResult = await _eventService.GetPublicEventAsync(id);
        if (eventResult == null) return NotFound(new { message = "Evento no encontrado" });
        return Ok(eventResult);
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return Guid.Parse(userIdClaim);
    }
}
