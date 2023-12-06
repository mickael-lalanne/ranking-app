namespace ranking_app;

public class SignResponse
{
    public required string Apikey { get; set; }
    public required long Timestamp { get; set; }
    public required string Signature { get; set; }
    public required string Cloudname { get; set; }
    public required string Folder { get; set; }

}

public class SignPayload
{
    public required string UserId { get; set; }
}
