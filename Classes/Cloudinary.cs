namespace ranking_app.Models;

public class SignData
{
    public required string Apikey { get; set; }
    public required long Timestamp { get; set; }
    public required string Signature { get; set; }
    public required string Cloudname { get; set; }

}
