using System;
using System.Collections.Generic;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Web.Public.Controllers.Api
{
    public class SeasonTeamsController : ApiControllerBase
    {
        private readonly ISeasonRepository _seasonRepo;

        public SeasonTeamsController(ISeasonRepository seasonRepo)
        {
            _seasonRepo = seasonRepo;
        }

        public IEnumerable<SeasonTeam> Get()
        {
            var seasonTeams = _seasonRepo.GetSeasonTeams();
            return seasonTeams;
        }

        public IEnumerable<SeasonTeam> GetBySeasonId(Guid id)
        {
            var seasonTeams = _seasonRepo.GetSeasonTeams(id);
            return seasonTeams;
        }
    }
}