using System;
using System.Collections.Generic;
using Ligi.Core.Model;

namespace Ligi.Core.DataAccess
{
    public interface ISeasonRepository : IRepository<Season>
    {
        IEnumerable<Season> GetByLeagueId(Guid leagueId);
        IEnumerable<SeasonTeam> GetSeasonTeams();
        IEnumerable<SeasonTeam> GetSeasonTeams(Guid seasonId);
    }
}
