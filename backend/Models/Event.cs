using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Event
{
    [Key]
    public Guid Id { get; set; }

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

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? Organizer { get; set; }

    [Required]
    public bool IsPublic { get; set; } = true;

    [Required]
    public bool RequiresApproval { get; set; } = false;

    public int? Capacity { get; set; }

    [MaxLength(1000)]
    public string? CoverImageUrl { get; set; }

    [Column(TypeName = "jsonb")]
    public string? FormSchema { get; set; }

    [Column(TypeName = "jsonb")]
    public string? SocialLinks { get; set; }

    [Required]
    public bool GenerateTickets { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property for participants
    public ICollection<Participant> Participants { get; set; } = new List<Participant>();
}
