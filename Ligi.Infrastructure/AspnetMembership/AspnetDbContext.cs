using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using Ligi.Infrastructure.AspnetMembership.Mapping;

namespace Ligi.Infrastructure.AspnetMembership
{
    public class AspnetDbContext : DbContext
    {
        static AspnetDbContext()
        {
            System.Data.Entity.Database.SetInitializer<AspnetDbContext>(null);
        }

        public AspnetDbContext()
            : base(nameOrConnectionString: "Ligi")
        { }

        public AspnetDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        { }

        public DbSet<Application> Applications { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UsersOpenAuthAccount> UsersOpenAuthAccounts { get; set; }
        public DbSet<UsersOpenAuthData> UsersOpenAuthData { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ApplicationMap());
            modelBuilder.Configurations.Add(new MembershipMap());
            modelBuilder.Configurations.Add(new ProfileMap());
            modelBuilder.Configurations.Add(new RoleMap());
            modelBuilder.Configurations.Add(new UserMap());
            modelBuilder.Configurations.Add(new UsersOpenAuthAccountMap());
            modelBuilder.Configurations.Add(new UsersOpenAuthDataMap());

            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }

        public T Find<T>(Guid id) where T : class
        {
            return Set<T>().Find(id);
        }

        public IQueryable<T> Query<T>() where T : class
        {
            return Set<T>();
        }
    }
}
