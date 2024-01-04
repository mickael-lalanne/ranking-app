using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ranking_app.Data;
using ranking_app.Models;

namespace ranking_app.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class TemplateController : ControllerBase
{
    
    private readonly RankingAppDbContext _context;

    public TemplateController(RankingAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TemplateModel>>> GetTemplates()
    {
        var test = User.FindFirst(ClaimTypes.NameIdentifier).Value;
        return await _context.Templates
            .Where(template => template.UserId == UserId())
            .Include(template => template.Tiers)
            .Include(template => template.Elements)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TemplateModel>> GetTemplate(Guid id)
    {
        var template = await _context.Templates
            .Where(template => template.Id == id)
            .Include(template => template.Tiers)
            .Include(template => template.Elements)
            .FirstAsync();

        if (template == null)
        {
            return NotFound();
        }

        if (template.UserId != UserId())
        {
            return Forbid();
        }

        return template;
    }

    [HttpPost]
    public async Task<ActionResult<TemplateModel>> PostTemplate(TemplateModel template)
    {
        template.CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        template.UserId = UserId();
        _context.Templates.Add(template);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTemplate", new { id = template.Id }, template);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTemplate(Guid id, TemplatePutPayload template)
    {
        if (id != template.Id)
        {
            return BadRequest();
        }

        if (UserId() != template.UserId)
        {
            return Forbid();
        }

        try
        {
            var baseTemplate = await _context.Templates
                .Where(template => template.Id == id)
                .Include(template => template.Tiers)
                .Include(template => template.Elements)
                .FirstAsync();
            
            baseTemplate.Name = template.Name;

            // TO UPDATE TIERS
            // First, remove all existing tiers
            if (baseTemplate.Tiers.Any())
            {
                _context.Tiers.RemoveRange(baseTemplate.Tiers);
                await _context.SaveChangesAsync();
            }
            // Then, add all tiers presents in the tierlist parameter
            foreach (Tier tier in template.Tiers)
            {
                baseTemplate.Tiers.Add(tier);
            }

            // Check for deleted elements
            foreach (var baseElement in baseTemplate.Elements)
            {
                // If the base tier is not present in the template to update
                if (template.Elements.Any(element => element.Id == baseElement.Id) == false) {
                    // We have to remove it from the database
                    baseTemplate.Elements.Remove(baseElement);
                }
            }

            // Check for elements to add
            foreach (var element in template.Elements)
            {
                // If a tier has no id, we have to create it
                if (element.Id == null) {
                    baseTemplate.Elements.Add(element);
                }
            }

            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TemplateExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        TemplateModel template = await _context.Templates
            .Where(template => template.Id == id)
            .Include(template => template.Tiers)
            .Include(template => template.Elements)
            .FirstAsync();

        if (template == null)
        {
            return NotFound();
        }

        if (template.UserId != UserId())
        {
            return Forbid();
        }

        // First, delete all tierlists linked to the template
        IEnumerable<TierlistModel> tierlists = await _context.Tierlists
            .Where(tierlist => tierlist.TemplateId == id)
            .Include(tierlist => tierlist.RankedElements)
            .ToListAsync();
        
        foreach (TierlistModel tierlist in tierlists)
        {
            _context.Tierlists.Remove(tierlist);
        }

        // Then, we can delete the template
        _context.Templates.Remove(template);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Called only in Cypress e2e tests
    [HttpDelete]
    [AllowAnonymous]
    [Route("deleteE2E")]
    public async Task<IActionResult> DeleteTemplates()
    {
        const string E2E_USER_ID = "user_2a0OKch2BahyWcB5z8IRDVIg65l";

        // First, delete all tierlists linked to the user id
        IEnumerable<TierlistModel> tierlists = await _context.Tierlists
            .Where(tierlist => tierlist.UserId == E2E_USER_ID)
            .Include(tierlist => tierlist.RankedElements)
            .ToListAsync();

        foreach (TierlistModel tierlist in tierlists)
        {
            _context.Tierlists.Remove(tierlist);
        }

        // Then, we can delete all the templates
        IEnumerable<TemplateModel> templates = await _context.Templates
            .Where(template => template.UserId == E2E_USER_ID)
            .Include(template => template.Tiers)
            .Include(template => template.Elements)
            .ToListAsync();

        foreach (TemplateModel template in templates)
        {
            _context.Templates.Remove(template);
        }

        // Some ranked elements are created during the e2e tests with a template which is mocked
        // So we have to delete them manually

        // Retrieve the ranked elements ids from the .json mock used in e2e tests
        string path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/cypress/fixtures/template_sample.json");
        IEnumerable<TemplateModel>? sampleTemplates =
            JsonConvert.DeserializeObject<IEnumerable<TemplateModel>>(
                System.IO.File.ReadAllText(path)
            );

        if (sampleTemplates != null) {
            IEnumerable<Guid> elementsIdToDelete = sampleTemplates.ToArray()[0].Elements.Select(elt => elt.Id).ToArray();

            IEnumerable<RankedElement> rankedElementsToDelete = await _context.RankedElements
                .Where(rankedElement => elementsIdToDelete.Contains(rankedElement.ElementId))
                .ToListAsync();

            foreach (RankedElement rankedElement in rankedElementsToDelete) {
                _context.RankedElements.Remove(rankedElement);
            }
        }
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TemplateExists(Guid id)
    {
        return _context.Templates.Any(e => e.Id == id);
    }

    private string UserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier).Value;
    }
}
