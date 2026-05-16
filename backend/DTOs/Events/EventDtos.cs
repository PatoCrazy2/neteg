using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Events;

public class CreateEventRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(500)]
    public string Location { get; set; } = string.Empty;

    public bool IsPublic { get; set; } = true;
    public bool RequiresApproval { get; set; } = false;
    public int? Capacity { get; set; }
    public string? FormSchema { get; set; }
    public string? SocialLinks { get; set; }
    public bool GenerateTickets { get; set; } = true;
}

public class EventResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string OrganizerName { get; set; } = string.Empty;
    public bool IsPublic { get; set; }
    public bool RequiresApproval { get; set; }
    public int? Capacity { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? FormSchema { get; set; }
    public string? SocialLinks { get; set; }
    public string? OrganizerAvatarUrl { get; set; }
    public string? OrganizerBio { get; set; }
    public bool GenerateTickets { get; set; }
    public DateTime CreatedAt { get; set; }
}
