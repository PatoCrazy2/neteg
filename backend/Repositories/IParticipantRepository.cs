using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public interface IParticipantRepository
{
    Task<Participant> AddAsync(Participant participant);
    Task<Participant?> GetByIdAsync(Guid id);
    Task<IEnumerable<Participant>> GetByEventIdAsync(Guid eventId);
    Task<bool> ExistsAsync(Guid eventId, string email);
}
