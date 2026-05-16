using backend.Models;
using backend.Repositories;
using shared.DTOs.Participants;
using System.Text.Json;

namespace backend.Services;

public class ParticipantService : IParticipantService
{
    private readonly IParticipantRepository _participantRepository;
    private readonly IEventRepository _eventRepository;

    public ParticipantService(IParticipantRepository participantRepository, IEventRepository eventRepository)
    {
        _participantRepository = participantRepository;
        _eventRepository = eventRepository;
    }

    public async Task<ParticipantResponse> RegisterAsync(RegisterParticipantRequest request)
    {
        // 1. Verify event exists
        var eventEntity = await _eventRepository.GetByIdAsync(request.EventId);
        if (eventEntity == null)
            throw new Exception("El evento no existe.");

        // 2. Verify if already registered
        var alreadyRegistered = await _participantRepository.ExistsAsync(request.EventId, request.Email);
        if (alreadyRegistered)
            throw new Exception("Este correo ya está registrado para este evento.");

        // 3. Create participant
        var participant = new Participant
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            UserId = request.UserId,
            FullName = request.FullName,
            Email = request.Email,
            Status = "Registered",
            FormAnswers = JsonSerializer.Serialize(request.FormAnswers),
            RegisteredAt = DateTime.UtcNow
        };

        await _participantRepository.AddAsync(participant);

        // 4. Return response
        return MapToResponse(participant);
    }

    public async Task<IEnumerable<ParticipantResponse>> GetByEventIdAsync(Guid eventId)
    {
        var participants = await _participantRepository.GetByEventIdAsync(eventId);
        return participants.Select(MapToResponse);
    }

    private ParticipantResponse MapToResponse(Participant participant)
    {
        return new ParticipantResponse
        {
            Id = participant.Id,
            EventId = participant.EventId,
            FullName = participant.FullName,
            Email = participant.Email,
            Status = participant.Status,
            RegisteredAt = participant.RegisteredAt
        };
    }
}
