using System.Data.Entity;
using Ligi.Infrastructure.Common;
using Ligi.Infrastructure.Database;

namespace Ligi.Web.Public
{
    public class DatabaseSetup
    {
        public static void Initialize()
        {
            Database.DefaultConnectionFactory = new ServiceConfigurationSettingConnectionFactory(Database.DefaultConnectionFactory);

            Database.SetInitializer<AdminDbContext>(null);
            Database.SetInitializer<IndexDictionaryDbContext>(null);
            Database.SetInitializer<BetsDbContext>(null);
        }
    }
}