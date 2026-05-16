using backend.Models;
using backend.Repositories;
using shared.DTOs.Participants;
using System.Text.Json;
using Hangfire;
using shared.DTOs;
using shared.Interfaces;

namespace backend.Services;

public class ParticipantService : IParticipantService
{
    private readonly IParticipantRepository _participantRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IUserRepository _userRepository;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ITicketSecurityService _ticketSecurityService;

    public ParticipantService(
        IParticipantRepository participantRepository, 
        IEventRepository eventRepository,
        IUserRepository userRepository,
        IBackgroundJobClient backgroundJobClient,
        ITicketSecurityService ticketSecurityService)
    {
        _participantRepository = participantRepository;
        _eventRepository = eventRepository;
        _userRepository = userRepository;
        _backgroundJobClient = backgroundJobClient;
        _ticketSecurityService = ticketSecurityService;
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

        // 5. Enqueue Ticket Generation if required
        if (eventEntity.GenerateTickets)
        {
            var payload = new GenerateTicketJobPayload
            {
                ParticipantId = participant.Id,
                EventId = eventEntity.Id
            };

            var jobId = _backgroundJobClient.Enqueue<IGenerateTicketJob>(x => x.ExecuteAsync(payload));
            
            participant.TicketJobId = jobId;
            participant.TicketStatus = "Pending";
            
            await _participantRepository.UpdateAsync(participant);
        }
        else
        {
            participant.TicketStatus = "NotRequired";
            await _participantRepository.UpdateAsync(participant);
        }

        // 4. Return response
        return MapToResponse(participant);
    }

    public async Task<ParticipantResponse?> GetByIdAsync(Guid id)
    {
        var participant = await _participantRepository.GetByIdAsync(id);
        return participant != null ? MapToResponse(participant) : null;
    }

    public async Task<IEnumerable<ParticipantResponse>> GetByEventIdAsync(Guid eventId)
    {
        var participants = await _participantRepository.GetByEventIdAsync(eventId);
        return participants.Select(MapToResponse);
    }

    public async Task<ParticipantResponse?> GetUserParticipationAsync(Guid eventId, Guid userId)
    {
        var participant = await _participantRepository.GetUserParticipationAsync(eventId, userId);
        return participant != null ? MapToResponse(participant) : null;
    }

    public async Task<ParticipantResponse> VerifyTicketAsync(TicketQrPayload payload)
    {
        // 1. Cryptographic Validation
        var isValid = _ticketSecurityService.VerifySignature(payload.p, payload.e, payload.s);
        if (!isValid)
        {
            throw new Exception("Firma digital inválida. Posible intento de fraude.");
        }

        // 2. Fetch Participant
        var participant = await _participantRepository.GetByIdAsync(payload.p);
        if (participant == null)
        {
            throw new Exception("El participante no existe.");
        }

        // 3. Event Validation
        if (participant.EventId != payload.e)
        {
            throw new Exception("El boleto no corresponde a este evento.");
        }

        // 4. Double Entry Prevention
        if (participant.Attended)
        {
            // Throwing a custom exception message that we can catch in controller to return 409
            throw new InvalidOperationException("Este boleto ya ha sido utilizado.");
        }

        // 5. Register Attendance
        participant.Attended = true;
        participant.CheckInAt = DateTime.UtcNow;
        participant.Status = "CheckedIn";

        await _participantRepository.UpdateAsync(participant);

        return MapToResponse(participant);
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
            TicketUrl = participant.TicketUrl,
            TicketJobId = participant.TicketJobId,
            TicketStatus = participant.TicketStatus,
            Attended = participant.Attended,
            CheckInAt = participant.CheckInAt,
            RegisteredAt = participant.RegisteredAt
        };
    }
}
