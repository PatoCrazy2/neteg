using backend.Infrastructure;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class ParticipantRepository : IParticipantRepository
{
    private readonly AppDbContext _context;

    public ParticipantRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Participant> AddAsync(Participant participant)
    {
        await _context.Participants.AddAsync(participant);
        await _context.SaveChangesAsync();
        return participant;
    }

    public async Task<Participant?> GetByIdAsync(Guid id)
    {
        return await _context.Participants
            .Include(p => p.Event)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Participant>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.Participants
            .Where(p => p.EventId == eventId)
            .OrderByDescending(p => p.RegisteredAt)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(Guid eventId, string email)
    {
        return await _context.Participants
            .AnyAsync(p => p.EventId == eventId && p.Email.ToLower() == email.ToLower());
    }

    public async Task UpdateAsync(Participant participant)
    {
        _context.Participants.Update(participant);
        await _context.SaveChangesAsync();
    }
}
