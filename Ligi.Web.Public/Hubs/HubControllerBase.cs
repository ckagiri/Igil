using System;
using System.Web.Http;
using Ligi.Web.Public.Controllers.Api;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace Ligi.Web.Public.Hubs
{
    public abstract class HubControllerBase : ApiController
    {
        private IConnectionManager _connectionManager;

        protected HubControllerBase()
        {
        }

        public IHubConnectionContext Clients
        {
            get
            {
                if (HubContext == null)
                {
                    throw new InvalidOperationException(string.Format("No hub context could be found for the HubController of type '{0}'.", GetType().Name));
                }
                return HubContext.Clients;
            }
        }

        protected abstract IHubContext HubContext
        {
            get;
        }

        protected IConnectionManager ConnectionManager
        {
            get
            {
                if (_connectionManager == null)
                {
                    _connectionManager = ResolveConnectionManager();
                }
                return _connectionManager;
            }
        }

        private IConnectionManager ResolveConnectionManager()
        {
            if (Configuration != null)
            {
                IConnectionManager connectionManager = Configuration.DependencyResolver.GetService(typeof(IConnectionManager)) as IConnectionManager;
                if (connectionManager != null)
                {
                    return connectionManager;
                }
            }

            // If connection manager cannot be resolved by DependencyResolver, use the default connection manager instead.
            return GlobalHost.ConnectionManager;
        }
    }
}
