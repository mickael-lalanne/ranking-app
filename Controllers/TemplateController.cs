using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ranking_app.Data;
using ranking_app.Models;

namespace ranking_app.Controllers;

[ApiController]
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
        return await _context.Templates
            .Include(template => template.Tiers)
            .Include(template => template.Elements)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TemplateModel>> GetTemplate(int id)
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

        return template;
    }

    [HttpPost]
    public async Task<ActionResult<TemplateModel>> PostTemplate(TemplateModel template)
    {
        template.CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        _context.Templates.Add(template);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTemplate", new { id = template.Id }, template);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTemplate(int id, TemplatePutPayload template)
    {
        if (id != template.Id)
        {
            return BadRequest();
        }

        try
        {
            var baseTemplate = await _context.Templates
                .Where(template => template.Id == id)
                .Include(template => template.Tiers)
                .Include(template => template.Elements)
                .FirstAsync();
            
            baseTemplate.Name = template.Name;

            // Check for tiers to delete
            foreach (var baseTier in baseTemplate.Tiers)
            {
                // If the base tier is not present in the template to update
                if (template.Tiers.Any(tier => tier.Id == baseTier.Id) == false) {
                    // We have to remove it from the database
                    baseTemplate.Tiers.Remove(baseTier);
                }
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

            // Check for tiers to add
            foreach (var tier in template.Tiers)
            {
                // If a tier has no id, we have to create it
                if (tier.Id == null) {
                    baseTemplate.Tiers.Add(tier);
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
    public async Task<IActionResult> DeleteTemplate(int id)
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

        _context.Templates.Remove(template);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TemplateExists(int id)
    {
        return _context.Templates.Any(e => e.Id == id);
    }
}
