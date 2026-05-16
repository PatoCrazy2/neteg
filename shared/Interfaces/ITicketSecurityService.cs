namespace shared.Interfaces;

public interface ITicketSecurityService
{
    string GenerateSignature(Guid participantId, Guid eventId);
    bool VerifySignature(Guid participantId, Guid eventId, string signature);
}
