using System.ComponentModel.DataAnnotations;

namespace ranking_app;

public class RankedElement
{
    [Key]
    public Guid ElementId { get; set; }
    public Guid TierId { get; set; }
    public int Position { get; set; }
}
