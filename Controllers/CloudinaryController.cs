using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet;
using System.Security.Claims;

namespace ranking_app.Controllers;

[ApiController]
[Authorize]
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

    [Route("uploadSignature", Name="uploadSignature")]
    [HttpPost]
    public async Task<ActionResult<UploadSignResponse>> UploadSignature()
    {
        long timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
        string folder = UserId() + "/elements";
    
        IDictionary<string, object> parameters = new Dictionary<string, object>
        {
            { "folder", folder },
            { "timestamp", timestamp },
        };
        
        UploadSignResponse signData = new UploadSignResponse
        {
            Apikey = _config["Cloudinary:ApiKey"],
            Timestamp = timestamp,
            Signature = cloudinary.Api.SignParameters(parameters),
            Cloudname = _config["Cloudinary:CloudName"],
            Folder = folder
        };
    
        return signData;
    }

    [Route("deleteSignature", Name="deleteSignature")]
    [HttpPost]
    public async Task<ActionResult<ICollection<DeleteSignResponse>>> DeleteSignature([FromBody] List<string> publicIds)
    {
        List<DeleteSignResponse> response = new List<DeleteSignResponse>();
        long timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
    
        foreach (var publicId in publicIds)
        {    
            IDictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "public_id", publicId },
                { "timestamp", timestamp },
            };

            DeleteSignResponse signData = new DeleteSignResponse
            {
                Apikey = _config["Cloudinary:ApiKey"],
                Timestamp = timestamp,
                Signature = cloudinary.Api.SignParameters(parameters),
                Cloudname = _config["Cloudinary:CloudName"],
                PublicId = publicId
            };

            response.Add(signData);
        }
    
        return response;
    }

    private string UserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier).Value;
    }
}
