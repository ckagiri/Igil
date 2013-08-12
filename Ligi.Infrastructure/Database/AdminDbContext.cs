using System.Data.Entity;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Infrastructure.Database
{
    public class AdminDbContext : DbContext, IContext
    {
        static AdminDbContext()
        {
            System.Data.Entity.Database.SetInitializer(new AdminDbInitializer());
        }

        public AdminDbContext()
            : base(nameOrConnectionString: "Ligi") 
        { }

        public AdminDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Season>().HasMany(s => s.Teams).WithMany();
        }

        public DbSet<League> Leagues { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Fixture> Fixtures { get; set; }
    }
}
