using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ranking_app.Data;
using ranking_app.Models;

namespace ranking_app.Controllers;

[ApiController]
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
    public async Task<ActionResult<TierlistModel>> GetTierlist(int id)
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
    public async Task<IActionResult> PutTierlist(int id, TierlistModel tierlist)
    {
        if (id != tierlist.Id)
        {
            return BadRequest();
        }

        _context.Entry(tierlist).State = EntityState.Modified;

        // Update the ranked elements
        tierlist.RankedElements.ToList().ForEach(rankedElement =>
            _context.Entry(rankedElement).State = EntityState.Modified
        );

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
    public async Task<IActionResult> DeleteTierlist(int id)
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

    private bool TierlistExists(int id)
    {
        return _context.Tierlists.Any(e => e.Id == id);
    }
}
