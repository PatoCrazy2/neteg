using backend.Models;
using backend.Repositories;
using shared.DTOs.Participants;
using System.Text.Json;

namespace backend.Services;

public class ParticipantService : IParticipantService
{
    private readonly IParticipantRepository _participantRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IUserRepository _userRepository;

    public ParticipantService(
        IParticipantRepository participantRepository, 
        IEventRepository eventRepository,
        IUserRepository userRepository)
    {
        _participantRepository = participantRepository;
        _eventRepository = eventRepository;
        _userRepository = userRepository;
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

        // 3. Link to user if not provided but email matches an existing user
        var userId = request.UserId;
        if (userId == null)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user != null)
            {
                userId = user.Id;
            }
        }

        // 4. Create participant
        var participant = new Participant
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            UserId = userId,
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
