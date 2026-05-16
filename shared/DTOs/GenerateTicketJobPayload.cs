namespace shared.DTOs;

public class GenerateTicketJobPayload
{
    public Guid ParticipantId { get; set; }
    public Guid EventId { get; set; }
}
