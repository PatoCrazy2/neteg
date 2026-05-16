namespace shared.DTOs;

public class TicketQrPayload
{
    /// <summary>
    /// Participant ID
    /// </summary>
    public Guid p { get; set; }

    /// <summary>
    /// Event ID
    /// </summary>
    public Guid e { get; set; }

    /// <summary>
    /// Digital Signature (Shortened Hash)
    /// </summary>
    public string s { get; set; } = string.Empty;

    public override string ToString()
    {
        // Serialización minimalista: p:guid|e:guid|s:sig
        return $"p:{p}|e:{e}|s:{s}";
    }

    public static TicketQrPayload? Parse(string qrText)
    {
        try
        {
            var parts = qrText.Split('|');
            if (parts.Length != 3) return null;

            var payload = new TicketQrPayload();
            foreach (var part in parts)
            {
                var kv = part.Split(':');
                if (kv.Length != 2) continue;

                switch (kv[0])
                {
                    case "p": payload.p = Guid.Parse(kv[1]); break;
                    case "e": payload.e = Guid.Parse(kv[1]); break;
                    case "s": payload.s = kv[1]; break;
                }
            }

            return payload;
        }
        catch
        {
            return null;
        }
    }
}
