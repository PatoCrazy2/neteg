using backend.Infrastructure;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class EventRepository : IEventRepository
{
    private readonly AppDbContext _context;

    public EventRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetByIdAsync(Guid id)
    {
        return await _context.Events
            .Include(e => e.Organizer)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<IEnumerable<Event>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Events
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> GetByParticipantUserIdAsync(Guid userId)
    {
        return await _context.Participants
            .Where(p => p.UserId == userId)
            .Select(p => p.Event!)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<Event> AddAsync(Event @event)
    {
        await _context.Events.AddAsync(@event);
        return @event;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
