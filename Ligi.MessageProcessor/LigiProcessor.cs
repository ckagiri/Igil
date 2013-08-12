using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using Ligi.Core;
using Ligi.Core.Commands;
using Ligi.Core.DataAccess;
using Ligi.Core.DomainBase;
using Ligi.Core.EventSourcing;
using Ligi.Core.Events;
using Ligi.Core.Handlers;
using Ligi.Core.Messaging;
using Ligi.Core.Model;
using Ligi.Core.Processes;
using Ligi.Core.Services;
using Ligi.Core.Services.Impl;
using Ligi.Infrastructure.AspnetMembership;
using Ligi.Infrastructure.DataAccess;
using Ligi.Infrastructure.Database;
using Ligi.Infrastructure.EventSourcing;
using Ligi.Infrastructure.MessageLog;
using Ligi.Infrastructure.Messaging;
using Ligi.Infrastructure.Messaging.Handling;
using Ligi.Infrastructure.Messaging.Implementation;
using Ligi.Infrastructure.Processes;
using Ligi.Infrastructure.Projections;
using Ligi.Infrastructure.ReadModel.Contracts;
using Ligi.Infrastructure.ReadModel.Impl;
using Ligi.Infrastructure.Serialization;
using Microsoft.Practices.Unity;

namespace Ligi.MessageProcessor
{
    public sealed class LigiProcessor : IDisposable
    {
        private readonly IUnityContainer _container;
        private readonly CancellationTokenSource _cancellationTokenSource;
        private readonly List<IProcessor> _processors;
        private bool _instrumentationEnabled;

        public LigiProcessor(bool instrumentationEnabled = false)
        {
            _instrumentationEnabled = instrumentationEnabled;
            _cancellationTokenSource = new CancellationTokenSource();
            _container = CreateContainer();
            _processors = _container.ResolveAll<IProcessor>().ToList();
        
        }

        public void Start()
        {
            _processors.ForEach(p => p.Start());
        }

        public void Stop()
        {
            _cancellationTokenSource.Cancel();

            _processors.ForEach(p => p.Stop());
        }

        public void Dispose()
        {
            _container.Dispose();
            _cancellationTokenSource.Dispose();
        }

        private UnityContainer CreateContainer()
        {
            var container = new UnityContainer();

            // infrastructure
            container.RegisterInstance<ITextSerializer>(new JsonTextSerializer());
            container.RegisterInstance<IMetadataProvider>(new StandardMetadataProvider());

            container.RegisterType<DbContext, AspnetDbContext>("membership", new TransientLifetimeManager(), new InjectionConstructor("Membership"));
            container.RegisterType<Func<AspnetDbContext>>(new InjectionFactory(i => 
                new Func<AspnetDbContext>(() => container.Resolve<AspnetDbContext>("membership"))));

            container.RegisterType<DbContext, BettingProcessDbContext>("betting", new TransientLifetimeManager(), new InjectionConstructor("Betting"));
            container.RegisterType<IProcessManagerDataContext<BookieProcess>, SqlProcessManagerDataContext<BookieProcess>>(
                    new TransientLifetimeManager(),
                    new InjectionConstructor(new ResolvedParameter<Func<DbContext>>("betting"), typeof(ICommandBus), typeof(ITextSerializer)));
            container.RegisterType<IProcessManagerDataContext<BetProcess>, SqlProcessManagerDataContext<BetProcess>>(
                    new TransientLifetimeManager(),
                    new InjectionConstructor(new ResolvedParameter<Func<DbContext>>("betting"), typeof (ICommandBus), typeof (ITextSerializer)));

            container.RegisterType<DbContext, IndexDictionaryDbContext>("indexdic", new TransientLifetimeManager(), new InjectionConstructor("IndexDictionary"));
            container.RegisterType<Func<IndexDictionaryDbContext>>(new InjectionFactory(i =>
                new Func<IndexDictionaryDbContext>(() => container.Resolve<IndexDictionaryDbContext>("indexdic"))));

            container.RegisterType<IDataContext<FixtureBookieIndex>, SqlDataContext<FixtureBookieIndex>>(
                new TransientLifetimeManager(),
                new InjectionConstructor(new ResolvedParameter<Func<DbContext>>("indexdic"), typeof(IEventBus)));

            container.RegisterType<BetsDbContext>("bets", new TransientLifetimeManager(), new InjectionConstructor("Bets"));
            container.RegisterType<Func<BetsDbContext>>(new InjectionFactory(i =>
                new Func<BetsDbContext>(() => container.Resolve<BetsDbContext>("bets"))));

            container.RegisterType<IWeekAccountDao, WeekAccountDao>(new ContainerControlledLifetimeManager());
            container.RegisterType<IFixtureBookiesDao, FixtureBookiesDao>(new ContainerControlledLifetimeManager());
            container.RegisterType<IUserDao, UserDao>(new ContainerControlledLifetimeManager());
            container.RegisterType<IPayoutService, PayoutService>(new ContainerControlledLifetimeManager());

            // handlers
            container.RegisterType<ICommandHandler, BettorCommandHandler>("BettorCommandHandler");
            container.RegisterType<ICommandHandler, BookieCommandHandler>("BookieCommandHandler");
            container.RegisterType<ICommandHandler, FixtureBookiesHandler>("FixtureBookiesHandler");

            OnCreateContainer(container);

            return container;
        }

        void OnCreateContainer(UnityContainer container)
        {
            var serializer = container.Resolve<ITextSerializer>();
            var metadata = container.Resolve<IMetadataProvider>();

            var commandBus = new CommandBus(new MessageSender(Database.DefaultConnectionFactory, "SqlBus", "SqlBus.Commands"), serializer);
            var eventBus = new EventBus(new MessageSender(Database.DefaultConnectionFactory, "SqlBus", "SqlBus.Events"), serializer);

            var commandProcessor = new CommandProcessor(new MessageReceiver(Database.DefaultConnectionFactory, "SqlBus", "SqlBus.Commands"), serializer);
            var eventProcessor = new EventProcessor(new MessageReceiver(Database.DefaultConnectionFactory, "SqlBus", "SqlBus.Events"), serializer);

            container.RegisterInstance<ICommandBus>(commandBus);
            container.RegisterInstance<IEventBus>(eventBus);
            container.RegisterInstance<ICommandHandlerRegistry>(commandProcessor);
            container.RegisterInstance<IProcessor>("CommandProcessor", commandProcessor);
            container.RegisterInstance<IEventHandlerRegistry>(eventProcessor);
            container.RegisterInstance<IProcessor>("EventProcessor", eventProcessor);

            // Event log database and handler.
            container.RegisterType<SqlMessageLog>(new InjectionConstructor("MessageLog", serializer, metadata));
            container.RegisterType<IEventHandler, SqlMessageLogHandler>("SqlMessageLogHandler");
            container.RegisterType<ICommandHandler, SqlMessageLogHandler>("SqlMessageLogHandler");

            RegisterRepository(container);
            RegisterEventHandlers(container, eventProcessor);
            RegisterCommandHandlers(container);
        }

        private void RegisterEventHandlers(UnityContainer container, EventProcessor eventProcessor)
        {
            eventProcessor.Register(container.Resolve<BookieProcessRouter>());
            eventProcessor.Register(container.Resolve<BetProcessRouter>());
            eventProcessor.Register(container.Resolve<BookieAccountProjection>());
            eventProcessor.Register(container.Resolve<BookieBetsProjection>());
            eventProcessor.Register(container.Resolve<MonthLeaderBoardProjection>());
            eventProcessor.Register(container.Resolve<SeasonLeaderBoardProjection>());

            eventProcessor.Register(container.Resolve<SqlMessageLogHandler>());
        }

        private void RegisterRepository(UnityContainer container)
        {
            // repository
            container.RegisterType<EventStoreDbContext>(new TransientLifetimeManager(), new InjectionConstructor("EventStore"));
            container.RegisterType(typeof(IEventSourcedRepository<>), typeof(SqlEventSourcedRepository<>), new ContainerControlledLifetimeManager());
        }

        private static void RegisterCommandHandlers(IUnityContainer unityContainer)
        {
            var commandHandlerRegistry = unityContainer.Resolve<ICommandHandlerRegistry>();

            foreach (var commandHandler in unityContainer.ResolveAll<ICommandHandler>())
            {
                commandHandlerRegistry.Register(commandHandler);
            }
        }
    }
}
