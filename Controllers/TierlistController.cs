using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ranking_app.Data;
using ranking_app.Models;

namespace ranking_app.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class TierlistController : ControllerBase
{
    
    private readonly RankingAppDbContext _context;

    public TierlistController(RankingAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TierlistModel>>> GetTierlists()
    {
        return await _context.Tierlists
            .Include(tierlist => tierlist.RankedElements)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TierlistModel>> GetTierlist(Guid id)
    {
        var tierlist = await _context.Tierlists
            .Where(tierlist => tierlist.Id == id)
            .Include(tierlist => tierlist.RankedElements)
            .FirstAsync();

        if (tierlist == null)
        {
            return NotFound();
        }

        return tierlist;
    }

    [HttpPost]
    public async Task<ActionResult<TierlistModel>> PostTierlist(TierlistModel tierlist)
    {
        tierlist.CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        _context.Tierlists.Add(tierlist);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTierlist", new { id = tierlist.Id }, tierlist);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTierlist(Guid id, TierlistModel tierlist)
    {
        if (id != tierlist.Id)
        {
            return BadRequest();
        }

        TierlistModel baseTierlist = await _context.Tierlists
            .Where(tierlist => tierlist.Id == id)
            .Include(tierlist => tierlist.RankedElements)
            .FirstAsync();

        baseTierlist.Name = tierlist.Name;
        baseTierlist.TemplateId = tierlist.TemplateId;

        // TO UPDATE RANKED ELEMENTS
        // cf https://stackoverflow.com/a/39838558/22930358
        // First, remove all existing elements
        if (baseTierlist.RankedElements.Any())
        {
            _context.RankedElements.RemoveRange(baseTierlist.RankedElements);
            await _context.SaveChangesAsync();
        }
        // Then, add all elements presents in the tierlist parameter
        foreach (RankedElement rankedElt in tierlist.RankedElements)
        {
            baseTierlist.RankedElements.Add(rankedElt);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TierlistExists(id))
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
    public async Task<IActionResult> DeleteTierlist(Guid id)
    {
        var tierlist = await _context.Tierlists
            .Where(tierlist => tierlist.Id == id)
            .Include(tierlist => tierlist.RankedElements)
            .FirstAsync();

        if (tierlist == null)
        {
            return NotFound();
        }

        _context.Tierlists.Remove(tierlist);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TierlistExists(Guid id)
    {
        return _context.Tierlists.Any(e => e.Id == id);
    }
}
