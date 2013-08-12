using System.Data.Entity;
using Ligi.Infrastructure.AspnetMembership;
using Ligi.Infrastructure.Common;
using Ligi.Infrastructure.Database;
using Ligi.Infrastructure.EventSourcing;
using Ligi.Infrastructure.MessageLog;

namespace Ligi.MessageProcessor
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
            Database.SetInitializer<AspnetDbContext>(null);
            Database.SetInitializer<BettingProcessDbContext>(null);
            Database.SetInitializer<BetsDbContext>(null);
            Database.SetInitializer<IndexDictionaryDbContext>(null);
            Database.SetInitializer<EventStoreDbContext>(null);
            Database.SetInitializer<MessageLogDbContext>(null);
        }
    }
}
