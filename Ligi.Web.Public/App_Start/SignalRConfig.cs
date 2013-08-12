using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Json;
using Newtonsoft.Json;

namespace Ligi.Web.Public.App_Start
{
    public class SignalRConfig
    {
        public static void RegisterHubs()
        {
            var serializerSettings = new JsonSerializerSettings
                                         {
                                             ContractResolver = new SignalRContractResolver()
                                         };
            var jsonNetSerializer = new JsonNetSerializer(serializerSettings);
            GlobalHost.DependencyResolver.Register(typeof (IJsonSerializer), () => jsonNetSerializer);

            RouteTable.Routes.MapHubs();
        }
    }
}