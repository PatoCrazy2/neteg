using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;
using shared.DTOs;

// Manual Signature Generation (matches TicketSecurityService logic)
string GenerateSignature(Guid p, Guid e, string secret)
{
    var payload = $"{p}:{e}";
    var keyBytes = Encoding.UTF8.GetBytes(secret);
    var payloadBytes = Encoding.UTF8.GetBytes(payload);
    using var hmac = new HMACSHA256(keyBytes);
    var hashBytes = hmac.ComputeHash(payloadBytes);
    return Convert.ToBase64String(hashBytes).Substring(0, 16);
}

// 1. Config
string apiUrl = "http://localhost:5000/api/participants/verify-ticket";
string secretKey = "SuperSecretKey12345!@#";

// These IDs must exist in your DB for a full test.
// Since I don't want to mess with your DB too much, 
// I'll assume you have a participant ID and event ID.
// If not, this will return 400 "El participante no existe".

Guid participantId = Guid.Parse("c1aaadb5-5a24-4588-aad1-972461fdb1ae"); 
Guid eventId = Guid.Parse("056e41dd-5c89-4182-a1d9-6060f0434ca3"); 

Console.WriteLine("=== PHASE 2 INTEGRATION TEST ===");

// 2. Generate Valid Signature
string signature = GenerateSignature(participantId, eventId, secretKey);
var payload = new TicketQrPayload { p = participantId, e = eventId, s = signature };

Console.WriteLine($"Testing with Payload: {payload}");

// 3. Send Request
using var client = new HttpClient();
try 
{
    var response = await client.PostAsJsonAsync(apiUrl, payload);
    var content = await response.Content.ReadAsStringAsync();

    Console.WriteLine($"Status Code: {response.StatusCode}");
    if (!response.IsSuccessStatusCode)
    {
        Console.WriteLine("ERROR DETAILS:");
    }
    Console.WriteLine(content);
}
catch (Exception ex)
{
    Console.WriteLine($"Error connecting to API: {ex.Message}");
    Console.WriteLine("Make sure the backend is running with 'dotnet run --project backend'");
}
