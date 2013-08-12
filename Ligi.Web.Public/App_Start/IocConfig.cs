using System.Data.Entity;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Messaging;
using Ligi.Infrastructure.DataAccess;
using Ligi.Infrastructure.Database;
using Ligi.Infrastructure.Messaging;
using Ligi.Infrastructure.Messaging.Implementation;
using Ligi.Infrastructure.ReadModel.Contracts;
using Ligi.Infrastructure.ReadModel.Impl;
using Ligi.Infrastructure.Serialization;
using Microsoft.Practices.Unity;

namespace Ligi.Web.Public.App_Start
{
    public class IocConfig
    {
        public static IUnityContainer Container { get; set; }

        public static void RegisterIoc(HttpConfiguration config)
        {
            DatabaseSetup.Initialize();
            Container = CreateContainer();
            // Tell WebApi how to use our Unity IoC
            config.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(Container);
        }

        private static UnityContainer CreateContainer()
        {
            var container = new UnityContainer();
            try
            {
                container.RegisterType<AdminDbContext>(new TransientLifetimeManager());
                container.RegisterType<IndexDictionaryDbContext>(new TransientLifetimeManager(),
                                                                 new InjectionConstructor("indexdictionary"));
                container.RegisterType<BetsDbContext>(new TransientLifetimeManager(), new InjectionConstructor("Bets"));

                container.RegisterType<IUnitOfWork, AdminUnitOfWork>();
                container.RegisterType<ILeagueRepository, LeagueRepository>();
                container.RegisterType<ISeasonRepository, SeasonRepository>();
                container.RegisterType<ITeamRepository, TeamRepository>();
                container.RegisterType<IFixtureRepository, FixtureRepository>();

                container.RegisterType<IWeekAccountDao, WeekAccountDao>(new ContainerControlledLifetimeManager());
                container.RegisterType<IBetsDao, BetsDao>(new ContainerControlledLifetimeManager());
                container.RegisterType<ILeaderBoardDao, LeaderBoardDao>(new ContainerControlledLifetimeManager());

                // configuration specific settings
                OnCreateContainer(container);

                return container;
            }
            catch
            {
                container.Dispose();
                throw;
            }
        }

        private static void OnCreateContainer(UnityContainer container)
        {
            var serializer = new JsonTextSerializer();
            container.RegisterInstance<ITextSerializer>(serializer);

            container.RegisterType<IMessageSender, MessageSender>(
                "Commands", new TransientLifetimeManager(), new InjectionConstructor(Database.DefaultConnectionFactory, "SqlBus", "SqlBus.Commands"));
            container.RegisterType<ICommandBus, CommandBus>(
                new ContainerControlledLifetimeManager(), new InjectionConstructor(new ResolvedParameter<IMessageSender>("Commands"), serializer));
        }
    }
}