using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace shared.DTOs.Participants;

public class RegisterParticipantRequest
{
    [Required]
    public Guid EventId { get; set; }

    public Guid? UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    // Dictionary for dynamic answers: { "questionId": "Answer" }
    public Dictionary<string, string> FormAnswers { get; set; } = new();
}

public class ParticipantResponse
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? TicketUrl { get; set; }
    public string? TicketJobId { get; set; }
    public string? TicketStatus { get; set; }
    public bool Attended { get; set; }
    public DateTime? CheckInAt { get; set; }
    public string? AccessPin { get; set; }
    public DateTime RegisteredAt { get; set; }
}

public class VerifyPinRequest
{
    [Required]
    public Guid EventId { get; set; }

    [Required]
    [MaxLength(6)]
    public string Pin { get; set; } = string.Empty;
}
