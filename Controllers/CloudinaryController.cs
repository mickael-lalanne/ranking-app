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

    [HttpGet]
    public async Task<ActionResult<SignData>> GetSignature()
    {
        long timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
    
        IDictionary<string, object> parameters = new Dictionary<string, object>
        {
            { "timestamp", timestamp },
        };
        
        SignData signData = new SignData
        {
            Apikey = _config["Cloudinary:ApiKey"],
            Timestamp = timestamp,
            Signature = cloudinary.Api.SignParameters(parameters),
            Cloudname = _config["Cloudinary:CloudName"]
        };
    
        return signData;
    }
}
