using System;
using Microsoft.Extensions.Configuration;
using shared.DTOs;
using backend.Services;

Console.WriteLine("=== NETEG TICKET SECURITY VALIDATOR ===");
Console.WriteLine("---------------------------------------");

// 1. Setup
var config = new ConfigurationBuilder()
    .AddInMemoryCollection(new Dictionary<string, string?> {
        {"Ticket:SecretKey", "SuperSecretKey12345!@#"}
    })
    .Build();

var securityService = new TicketSecurityService(config);

var participantId = Guid.NewGuid();
var eventId = Guid.NewGuid();
var wrongEventId = Guid.NewGuid();
var wrongParticipantId = Guid.NewGuid();

// 2. Execution - CASE 1: SUCCESS
Console.WriteLine("[TEST 1] Scenario: Valid Ticket Generation and Parsing...");
string signature = securityService.GenerateSignature(participantId, eventId);
var payload = new TicketQrPayload { p = participantId, e = eventId, s = signature };
string qrText = payload.ToString();

Console.WriteLine($"  QR Text generated: {qrText}");

var parsedPayload = TicketQrPayload.Parse(qrText);
if (parsedPayload != null && securityService.VerifySignature(parsedPayload.p, parsedPayload.e, parsedPayload.s))
{
    Console.WriteLine("  RESULT: PASS ✅ (Ticket is valid)");
}
else
{
    Console.WriteLine("  RESULT: FAIL ❌ (Validation failed)");
}

// 3. Execution - CASE 2: FRAUD (Wrong Participant)
Console.WriteLine("\n[TEST 2] Scenario: Tampering with Participant ID...");
if (securityService.VerifySignature(wrongParticipantId, eventId, signature))
{
    Console.WriteLine("  RESULT: FAIL ❌ (Accepted tampered participant!)");
}
else
{
    Console.WriteLine("  RESULT: PASS ✅ (Rejected tampered participant)");
}

// 4. Execution - CASE 3: FRAUD (Wrong Event / Ticket reuse)
Console.WriteLine("\n[TEST 3] Scenario: Using ticket for another event...");
if (securityService.VerifySignature(participantId, wrongEventId, signature))
{
    Console.WriteLine("  RESULT: FAIL ❌ (Accepted ticket for wrong event!)");
}
else
{
    Console.WriteLine("  RESULT: PASS ✅ (Rejected ticket for wrong event)");
}

Console.WriteLine("\n---------------------------------------");
Console.WriteLine("=== ALL TESTS COMPLETED ===");
