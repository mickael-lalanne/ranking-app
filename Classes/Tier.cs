namespace ranking_app;

public class Tier
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public int Rank { get; set; }
}

public class TierPayload : Tier
{
    new public int? Id { get; set; }
}
