using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ranking_app.Controllers;

[ApiController]
[Route("[controller]")]
public class TemplateController : ControllerBase
{
    private static readonly string[] MockTemplates = new[]
    {
        "bonjour", "hola"
    };

    [HttpGet]
    public string[] Get()
    {
        return MockTemplates;
    }
}
