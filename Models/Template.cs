namespace ranking_app.Models;

public class TemplateModel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int UserId { get; set; }
    public required TierModel[] Tiers { get; set; }
    public required ElementModel[] Elements { get; set; }
}
