using backend.DTOs.Events;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly IStorageService _storageService;

    public EventService(IEventRepository eventRepository, IStorageService storageService)
    {
        _eventRepository = eventRepository;
        _storageService = storageService;
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
            IsPublic = request.IsPublic,
            RequiresApproval = request.RequiresApproval,
            Capacity = request.Capacity,
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

    public async Task<string> UploadCoverImageAsync(Guid eventId, IFormFile file, Guid userId)
    {
        var @event = await _eventRepository.GetByIdAsync(eventId);
        
        if (@event == null) throw new KeyNotFoundException("Evento no encontrado");
        if (@event.UserId != userId) throw new UnauthorizedAccessException("No tienes permiso para editar este evento");

        // Subir a MinIO/S3
        var imageUrl = await _storageService.UploadFileAsync(file, "event-covers");

        // Borrar imagen anterior si existe
        if (!string.IsNullOrEmpty(@event.CoverImageUrl))
        {
            try { await _storageService.DeleteFileAsync(@event.CoverImageUrl); }
            catch { /* Ignorar errores al borrar */ }
        }

        @event.CoverImageUrl = imageUrl;
        await _eventRepository.UpdateAsync(@event);
        await _eventRepository.SaveChangesAsync();

        return imageUrl;
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
            IsPublic = e.IsPublic,
            RequiresApproval = e.RequiresApproval,
            Capacity = e.Capacity,
            CoverImageUrl = e.CoverImageUrl,
            CreatedAt = e.CreatedAt
        };
    }
}
