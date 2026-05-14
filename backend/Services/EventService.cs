using backend.DTOs.Events;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<EventResponse> CreateEventAsync(CreateEventRequest request, Guid userId)
    {
        var @event = new Event
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Date = request.Date,
            Location = request.Location,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _eventRepository.AddAsync(@event);
        await _eventRepository.SaveChangesAsync();

        // Get with organizer info for response
        var createdEvent = await _eventRepository.GetByIdAsync(@event.Id);

        return MapToResponse(createdEvent!);
    }

    public async Task<IEnumerable<EventResponse>> GetUserEventsAsync(Guid userId)
    {
        var events = await _eventRepository.GetByUserIdAsync(userId);
        return events.Select(MapToResponse);
    }

    public async Task<IEnumerable<EventResponse>> GetParticipatingEventsAsync(Guid userId)
    {
        var events = await _eventRepository.GetByParticipantUserIdAsync(userId);
        return events.Select(MapToResponse);
    }

    private EventResponse MapToResponse(Event e)
    {
        return new EventResponse
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Date = e.Date,
            Location = e.Location,
            UserId = e.UserId,
            OrganizerName = e.Organizer?.FullName ?? "Unknown",
            CreatedAt = e.CreatedAt
        };
    }
}
