using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet;
using ranking_app.Models;

namespace ranking_app.Controllers;

[ApiController]
[Route("[controller]")]
public class CloudinaryController : ControllerBase
{
    
    private readonly IConfiguration _config;
    private Cloudinary cloudinary;

    public CloudinaryController(IConfiguration config)
    {
        _config = config;

        string url = $"cloudinary://{_config["Cloudinary:ApiKey"]}:{_config["Cloudinary:ApiSecret"]}@{_config["Cloudinary:CloudName"]}";
        cloudinary = new Cloudinary(url);
        cloudinary.Api.Secure = true;

    }

    [HttpPost]
    public async Task<ActionResult<SignResponse>> AskSignature(SignPayload payload)
    {
        long timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
        string folder = payload.UserId + "/elements";
    
        IDictionary<string, object> parameters = new Dictionary<string, object>
        {
            { "folder", folder },
            { "timestamp", timestamp },
        };
        
        SignResponse signData = new SignResponse
        {
            Apikey = _config["Cloudinary:ApiKey"],
            Timestamp = timestamp,
            Signature = cloudinary.Api.SignParameters(parameters),
            Cloudname = _config["Cloudinary:CloudName"],
            Folder = folder
        };
    
        return signData;
    }
}
