using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class GoogleLoginRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
