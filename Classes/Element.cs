namespace ranking_app;

public class Element
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Image { get; set; }
    public int Type { get; set; }
}

public class ElementPayload : Element
{
    new public Guid? Id { get; set; }
}
