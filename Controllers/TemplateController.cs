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
    public async Task<IActionResult> PutTemplate(int id, TemplateModel template)
    {
        if (id != template.Id)
        {
            return BadRequest();
        }

        _context.Entry(template).State = EntityState.Modified;

        try
        {
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
