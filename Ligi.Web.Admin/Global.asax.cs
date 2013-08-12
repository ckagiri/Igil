using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Ligi.Core.Messaging;
using Ligi.Infrastructure.Messaging;
using Ligi.Infrastructure.Messaging.Implementation;
using Ligi.Infrastructure.Serialization;
using Ligi.Web.Admin.App_Start;

namespace Ligi.Web.Admin
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        public static IEventBus EventBus { get; private set; }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            IocConfig.RegisterIoc(GlobalConfiguration.Configuration);   

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            GlobalConfig.CustomizeConfig(GlobalConfiguration.Configuration);

            var serializer = new JsonTextSerializer();
            EventBus = new EventBus(new MessageSender(Database.DefaultConnectionFactory, "SqlBus", "SqlBus.Events"), serializer);
        }
    }
}