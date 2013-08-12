using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Security;
using Ligi.Core.Model;
using Ligi.Infrastructure.ReadModel;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Bet = Ligi.Infrastructure.ReadModel.Bet;

namespace Ligi.Web.Public.Hubs
{
    public class User
    {
        public string Name { get; set; }
        public HashSet<string> ConnectionIds { get; set; }
    }

    [HubName("ligi")]
    public class LigiHub : Hub
    {
        private static readonly ConcurrentDictionary<string, User> Users
             = new ConcurrentDictionary<string, User>(StringComparer.InvariantCultureIgnoreCase);

        public void Send(string message)
        {
            Clients.All.received(new { message = message });
        }

        public void Send(string message, string to)
        {
            User receiver;
            if (Users.TryGetValue(to, out receiver))
            {
                foreach (var cid in receiver.ConnectionIds)
                {
                    Clients.Client(cid).received(new { message = message });
                }
            }
        }

        public void UpdateWeekAccount(WeekAccount account)
        {
            var to = GetUserName(account.UserId);
            User receiver;
            if (Users.TryGetValue(to, out receiver))
            {
                foreach (var cid in receiver.ConnectionIds)
                {
                    Clients.Client(cid).updateWeekAccount(new { message = account });
                }
            }
        }

        public void UpsertBet(Bet bet)
        {
            var to = GetUserName(bet.UserId);
            User receiver;
            if (Users.TryGetValue(to, out receiver))
            {
                foreach (var cid in receiver.ConnectionIds)
                {
                    Clients.Client(cid).upsertBet(new { message = bet });
                }
            }

        }

        public void UpsertFixture(Fixture fixture)
        {
            Clients.All.upsertFixture(new { message = fixture });
        }

        public void RemoveFixture(Guid fixtureId)
        {
            Clients.All.removeFixture(new { message = fixtureId });
        }

        public override Task OnConnected()
        {
            string userName = Context.User.Identity.Name;
            string connectionId = Context.ConnectionId;

            var user = Users.GetOrAdd(userName, _ => new User
            {
                Name = userName,
                ConnectionIds = new HashSet<string>()
            });

            lock (user.ConnectionIds)
            {
                user.ConnectionIds.Add(connectionId);
            }

            return base.OnConnected();
        }

        public override Task OnDisconnected()
        {
            string userName = Context.User.Identity.Name;
            string connectionId = Context.ConnectionId;

            User user;
            Users.TryGetValue(userName, out user);

            if (user != null)
            {
                lock (user.ConnectionIds)
                {
                    user.ConnectionIds.RemoveWhere(cid => cid.Equals(connectionId));

                    if (!user.ConnectionIds.Any())
                    {
                        User removedUser;
                        Users.TryRemove(userName, out removedUser);
                    }
                }
            }

            return base.OnDisconnected();
        }

        private string GetUserName(Guid userId)
        {
            var membershipUser = Membership.GetUser(userId, true /* userIsOnline */);
            if (membershipUser == null) return "";
            var userName = membershipUser.UserName;
            return userName;
        }
    }
}