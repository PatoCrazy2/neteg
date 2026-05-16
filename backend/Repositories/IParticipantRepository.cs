using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public interface IParticipantRepository
{
    Task<Participant> AddAsync(Participant participant);
    Task<Participant?> GetByIdAsync(Guid id);
    Task<IEnumerable<Participant>> GetByEventIdAsync(Guid eventId);
    Task<Participant?> GetUserParticipationAsync(Guid eventId, Guid userId);
    Task<bool> ExistsAsync(Guid eventId, string email);
    Task UpdateAsync(Participant participant);
}
