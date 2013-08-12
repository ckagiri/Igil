using Ligi.Infrastructure.Common;
using System.Data.Entity;
using Ligi.Infrastructure.Database;

namespace Ligi.Web.Admin
{
    /// <summary>
    /// Initializes the EF infrastructure.
    /// </summary>
    internal static class DatabaseSetup
    {
        public static void Initialize()
        {
            Database.DefaultConnectionFactory = new ServiceConfigurationSettingConnectionFactory(Database.DefaultConnectionFactory);

            Database.SetInitializer<AdminDbContext>(null);
        }
    }
}