using Ligi.Core.DataAccess;
using Ligi.Core.Model;
using Ligi.Core.Validation;
using Ligi.Infrastructure.Validation;

namespace Ligi.Infrastructure.DataAccess
{
    public class LeagueRepository : RepositoryBase<League>, ILeagueRepository
    {
        public LeagueRepository(IUnitOfWork uow) : base(uow)
        { } 

        public override void Add(League league)
        {
            ValidationResultInfo vri = 
                new SaveLeagueValidator().Validate(league, DbContext);
            if (!vri.IsValid)
            {
                throw new DomainValidationException(vri);
            }

            base.Add(league);
        }
    }
}
