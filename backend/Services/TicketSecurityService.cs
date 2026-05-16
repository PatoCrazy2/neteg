using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using shared.Interfaces;

namespace backend.Services;

public class TicketSecurityService : ITicketSecurityService
{
    private readonly string _secretKey;

    public TicketSecurityService(IConfiguration configuration)
    {
        _secretKey = configuration["Ticket:SecretKey"] ?? "dev_secret_key_neteg_2024_change_me_in_production";
        
        if (_secretKey == "dev_secret_key_neteg_2024_change_me_in_production")
        {
            Console.WriteLine("[WARNING] Ticket:SecretKey not found in configuration. Using default dev key.");
        }
    }

    public string GenerateSignature(Guid participantId, Guid eventId)
    {
        var payload = $"{participantId}:{eventId}";
        var keyBytes = Encoding.UTF8.GetBytes(_secretKey);
        var payloadBytes = Encoding.UTF8.GetBytes(payload);

        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(payloadBytes);
        
        // Convertimos a Base64 y tomamos los primeros 16 caracteres para mantener el QR compacto
        return Convert.ToBase64String(hashBytes).Substring(0, 16);
    }

    public bool VerifySignature(Guid participantId, Guid eventId, string signature)
    {
        var expectedSignature = GenerateSignature(participantId, eventId);
        return string.Equals(expectedSignature, signature);
    }
}
