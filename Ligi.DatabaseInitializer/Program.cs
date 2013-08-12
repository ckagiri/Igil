using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ligi.Infrastructure.AspnetMembership;
using Ligi.Infrastructure.Database;
using Ligi.Infrastructure.EventSourcing;
using Ligi.Infrastructure.MessageLog;
using Ligi.Infrastructure.Messaging.Implementation;

namespace Ligi.DatabaseInitializer
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = ConfigurationManager.AppSettings["defaultConnection"];
            if (args.Length > 0)
            {
                connectionString = args[0];
            }

            // Use AdminContext as entry point for dropping and recreating DB
            //using (var context = new AdminDbContext())
            //{
            //    if (context.Database.Exists())
            //        context.Database.Delete();

            //    context.Database.Create();
            //}

            Database.SetInitializer<EventStoreDbContext>(null);
            Database.SetInitializer<MessageLogDbContext>(null);
            Database.SetInitializer<BetsDbContext>(null);
            Database.SetInitializer<BettingProcessDbContext>(null);
            Database.SetInitializer<IndexDictionaryDbContext>(null);
            Database.SetInitializer<AspnetDbContext>(null);

            DbContext[] contexts =
                new DbContext[] 
                { 
                    new AspnetDbContext(connectionString), 
                    new EventStoreDbContext(connectionString),
                    new MessageLogDbContext(connectionString),
                    new IndexDictionaryDbContext(connectionString),
                    new BettingProcessDbContext(connectionString),
                    new BetsDbContext(connectionString)
                };

            foreach (DbContext context in contexts)
            {
                var adapter = (IObjectContextAdapter)context;

                var script = adapter.ObjectContext.CreateDatabaseScript();

                context.Database.ExecuteSqlCommand(script);

                context.Dispose();
            }

            MessagingDbInitializer.CreateDatabaseObjects(connectionString, "SqlBus");
        }
    }
}
