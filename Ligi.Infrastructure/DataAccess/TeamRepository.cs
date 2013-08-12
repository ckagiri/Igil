using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Infrastructure.DataAccess
{
    public class TeamRepository : RepositoryBase<Team>, ITeamRepository
    {
        public TeamRepository(IUnitOfWork uow) : base(uow)
        { }
    }
}
