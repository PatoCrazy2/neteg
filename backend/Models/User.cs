using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    // Nullable for OAuth users
    public string? PasswordHash { get; set; }

    [Required]
    [MaxLength(20)]
    public string AuthProvider { get; set; } = "Local";

    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "User";

    [MaxLength(1000)]
    public string? AvatarUrl { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
