using backend.Repositories;
using backend.Services;
using QRCoder;
using shared.DTOs;
using shared.Interfaces;

namespace worker.Jobs;

public class GenerateTicketJob : IGenerateTicketJob
{
    private readonly IParticipantRepository _participantRepository;
    private readonly IStorageService _storageService;
    private readonly ILogger<GenerateTicketJob> _logger;

    public GenerateTicketJob(
        IParticipantRepository participantRepository,
        IStorageService storageService,
        ILogger<GenerateTicketJob> logger)
    {
        _participantRepository = participantRepository;
        _storageService = storageService;
        _logger = logger;
    }

    public async Task ExecuteAsync(GenerateTicketJobPayload payload)
    {
        _logger.LogInformation("Starting ticket generation for participant {ParticipantId}", payload.ParticipantId);

        var participant = await _participantRepository.GetByIdAsync(payload.ParticipantId);
        if (participant == null)
        {
            _logger.LogError("Participant {ParticipantId} not found", payload.ParticipantId);
            return;
        }

        try
        {
            participant.TicketStatus = "Processing";
            await _participantRepository.UpdateAsync(participant);

            // 1. Generate QR Code
            // The QR contains the participant ID for check-in
            string qrText = participant.Id.ToString();
            
            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(qrText, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            byte[] qrCodeImage = qrCode.GetGraphic(20);

            // 2. Upload to S3
            using var stream = new MemoryStream(qrCodeImage);
            string fileName = $"{participant.Id}.png";
            string contentType = "image/png";
            
            string ticketUrl = await _storageService.UploadStreamAsync(stream, fileName, contentType, "tickets");

            // 3. Update Participant
            participant.TicketUrl = ticketUrl;
            participant.TicketStatus = "Completed";
            await _participantRepository.UpdateAsync(participant);

            _logger.LogInformation("Ticket generated successfully for participant {ParticipantId}: {TicketUrl}", 
                payload.ParticipantId, ticketUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating ticket for participant {ParticipantId}", payload.ParticipantId);
            participant.TicketStatus = "Failed";
            await _participantRepository.UpdateAsync(participant);
            throw; // Re-throw so Hangfire can retry
        }
    }
}
