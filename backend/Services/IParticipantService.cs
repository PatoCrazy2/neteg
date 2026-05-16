using shared.DTOs.Participants;
using shared.DTOs;

namespace backend.Services;

public interface IParticipantService
{
    Task<ParticipantResponse> RegisterAsync(RegisterParticipantRequest request);
    Task<ParticipantResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<ParticipantResponse>> GetByEventIdAsync(Guid eventId);
    Task<ParticipantResponse?> GetUserParticipationAsync(Guid eventId, Guid userId);
    Task<ParticipantResponse> VerifyTicketAsync(TicketQrPayload payload);
}
