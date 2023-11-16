namespace ranking_app.Models;

public class TemplateModel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int UserId { get; set; }
    public required ICollection<Tier> Tiers { get; set; }
    public required ICollection<Element> Elements { get; set; }
    public DateTime CreatedAt { get; set; }
}
