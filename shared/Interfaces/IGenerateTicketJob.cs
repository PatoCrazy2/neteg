using shared.DTOs;

namespace shared.Interfaces;

public interface IGenerateTicketJob
{
    Task ExecuteAsync(GenerateTicketJobPayload payload);
}
