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
        public DbSet<RankedElement> RankedElements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Set ValueGeneratedNever for ElementId property in ranked elements
            // Otherwise we can't update the ranked elements in the Tierlist's PUT method
            // cf https://stackoverflow.com/a/67448939/22930358
            modelBuilder.Entity<RankedElement>()
                .Property(p => p.ElementId)
                .ValueGeneratedNever();
        }
    }
}
