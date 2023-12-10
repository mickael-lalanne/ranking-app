namespace ranking_app;

public class SignResponse
{
    public required string Apikey { get; set; }
    public required long Timestamp { get; set; }
    public required string Signature { get; set; }
    public required string Cloudname { get; set; }

}

public class UploadSignResponse : SignResponse
{
    public required string Folder { get; set; }

}

public class DeleteSignResponse : SignResponse
{
    public required string PublicId { get; set; }

}

public class UploadSignPayload
{
    public required string UserId { get; set; }
}

public class DeleteSignPayload
{
    public required ICollection<string> PublicIds { get; set; }
}
