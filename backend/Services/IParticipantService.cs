using shared.DTOs.Participants;

namespace backend.Services;

public interface IParticipantService
{
    Task<ParticipantResponse> RegisterAsync(RegisterParticipantRequest request);
    Task<IEnumerable<ParticipantResponse>> GetByEventIdAsync(Guid eventId);
}
