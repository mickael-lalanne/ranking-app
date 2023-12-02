namespace ranking_app.Models;

public class TemplateModel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string UserId { get; set; }
    public ICollection<Tier> Tiers { get; set; }
    public ICollection<Element> Elements { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TemplatePutPayload : TemplateModel
{
    public ICollection<TierPayload> Tiers { get; set; }
    public required ICollection<ElementPayload> Elements { get; set; }
}
