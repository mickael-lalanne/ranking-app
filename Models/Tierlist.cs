namespace ranking_app.Models;

public class TierlistModel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int TemplateId { get; set; }
    public required string UserId { get; set; }
    public required ICollection<RankedElement> RankedElements { get; set; }
    public DateTime CreatedAt { get; set; }
}
