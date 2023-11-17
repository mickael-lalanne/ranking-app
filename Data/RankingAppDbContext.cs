using Microsoft.EntityFrameworkCore;
using ranking_app.Models;

namespace ranking_app.Data
{
    public class RankingAppDbContext: DbContext
    {
        public RankingAppDbContext(DbContextOptions<RankingAppDbContext> options) : base(options)
        {
        }

        public DbSet<TemplateModel> Templates { get; set; }
        public DbSet<TierlistModel> Tierlists { get; set; }
    }
}
