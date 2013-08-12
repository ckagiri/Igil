using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Messaging;
using Ligi.Infrastructure.DataAccess;
using Ligi.Infrastructure.Messaging;
using Ninject;

namespace Ligi.Web.Admin.App_Start
{
    public class IocConfig
    {
        public static void RegisterIoc(HttpConfiguration config)
        {
            DatabaseSetup.Initialize();

            var kernel = new StandardKernel(); // Ninject IoC
            kernel.Bind<IUnitOfWork>().To<AdminUnitOfWork>();
            kernel.Bind<ILeagueRepository>().To<LeagueRepository>();
            kernel.Bind<ISeasonRepository>().To<SeasonRepository>();
            kernel.Bind<ITeamRepository>().To<TeamRepository>();
            kernel.Bind<IFixtureRepository>().To<FixtureRepository>();

            // Tell WebApi how to use our Ninject IoC
            config.DependencyResolver = new NinjectDependencyResolver(kernel);
        }
    }
}