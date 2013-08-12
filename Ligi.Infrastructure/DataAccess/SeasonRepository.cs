using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;
using Ligi.Core.Validation;
using Ligi.Infrastructure.Validation;

namespace Ligi.Infrastructure.DataAccess
{
    public class SeasonRepository : RepositoryBase<Season>, ISeasonRepository
    {
        public SeasonRepository(IUnitOfWork uow) : base(uow)
        { }

        public IEnumerable<Season> GetByLeagueId(Guid leagueId)
        {
            return FindAll(s => s.LeagueId == leagueId);
        }

        public override void Add(Season season)
        {
            ValidationResultInfo vri =
                new SaveSeasonValidator().Validate(season, DbContext);
            if (!vri.IsValid)
            {
                throw new DomainValidationException(vri);
            }

            base.Add(season);
        }

        public IEnumerable<SeasonTeam> GetSeasonTeams()
        {
            return Query.Include("Teams")
                .SelectMany(s => s.Teams.Select(t =>
                    new SeasonTeam {SeasonId = s.Id, TeamId = t.Id})).ToArray();
        }

        public IEnumerable<SeasonTeam> GetSeasonTeams(Guid seasonId)
        {
            return Query.Include("Teams").Where(s => s.Teams != null)
                .SelectMany(s => s.Teams.Select(t =>
                    new SeasonTeam { SeasonId = s.Id, TeamId = t.Id })).ToArray();
        }
    }
}
