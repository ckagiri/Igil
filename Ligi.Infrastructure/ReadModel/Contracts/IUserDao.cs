using System;

namespace Ligi.Infrastructure.ReadModel.Contracts
{
    public interface IUserDao
    {
        string GetUserName(Guid userId);
    }
}
