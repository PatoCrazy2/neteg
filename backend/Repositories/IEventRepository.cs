using backend.Models;

namespace backend.Repositories;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(Guid id);
    Task<IEnumerable<Event>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Event>> GetByParticipantUserIdAsync(Guid userId);
    Task<Event> AddAsync(Event @event);
    Task UpdateAsync(Event @event);
    Task SaveChangesAsync();
}
