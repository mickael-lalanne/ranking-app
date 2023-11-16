namespace ranking_app.Models;

public class TierlistModel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int TemplateId { get; set; }
    public int UserId { get; set; }
    public required RankedElement[] RankedElements { get; set; }
}
