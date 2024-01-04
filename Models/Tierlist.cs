namespace ranking_app.Models;

public class TierlistModel
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public Guid TemplateId { get; set; }
    public string? UserId { get; set; }
    public required ICollection<RankedElement> RankedElements { get; set; }
    public DateTime CreatedAt { get; set; }
}
