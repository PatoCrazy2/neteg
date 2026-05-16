using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Participant
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid EventId { get; set; }

    [ForeignKey("EventId")]
    public Event? Event { get; set; }

    // Nullable if the participant is not a registered user yet
    public Guid? UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = "Registered"; // Registered, CheckedIn, Cancelled

    [Column(TypeName = "jsonb")]
    public string FormAnswers { get; set; } = "{}";

    public string? TicketUrl { get; set; }
    public string? TicketJobId { get; set; }
    public string? TicketStatus { get; set; }

    public bool Attended { get; set; } = false;
    public DateTime? CheckInAt { get; set; }

    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}
