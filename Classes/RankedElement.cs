using System.ComponentModel.DataAnnotations;

namespace ranking_app;

public class RankedElement
{
    [Key]
    public int ElementId { get; set; }
    public int TierId { get; set; }
    public int Position { get; set; }
}
