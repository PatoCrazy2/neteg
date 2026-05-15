using backend.DTOs.Events;

namespace backend.Services;

public interface IEventService
{
    Task<EventResponse> CreateEventAsync(CreateEventRequest request, Guid userId);
    Task<IEnumerable<EventResponse>> GetUserEventsAsync(Guid userId);
    Task<IEnumerable<EventResponse>> GetParticipatingEventsAsync(Guid userId);
    Task<string> UploadCoverImageAsync(Guid eventId, IFormFile file, Guid userId);
}
