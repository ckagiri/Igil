using System;
using System.Linq;
using Ligi.Infrastructure.AspnetMembership;

namespace Ligi.Infrastructure.ReadModel.Contracts
{
    public class UserDao : IUserDao
    {
        private readonly Func<AspnetDbContext> _contextFactory;

        public UserDao(Func<AspnetDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public string GetUserName(Guid userId)
        {
            using (var context = _contextFactory.Invoke())
            {
                var user = context.Query<User>().FirstOrDefault(u => u.UserId == userId);
                if (user != null)
                {
                    return user.UserName;
                }
                return " ";
            }
        }
    }
}
