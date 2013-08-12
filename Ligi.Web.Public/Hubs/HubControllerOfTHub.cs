using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Ligi.Web.Public.Hubs
{
    public abstract class HubController<THub> : HubControllerBase where THub : IHub
    {
        protected override IHubContext HubContext
        {
            get
            {
                return ConnectionManager.GetHubContext<THub>();
            }
        }
    }
}
