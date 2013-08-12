using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;
using Ligi.Core.Validation;

namespace Ligi.Web.Admin.Controllers.Api
{
    public class SeasonTeamsController : ApiControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly ISeasonRepository _seasonRepo;
        private readonly ITeamRepository _teamRepo;

        public SeasonTeamsController(IUnitOfWork uow, ISeasonRepository seasonRepo, ITeamRepository teamRepo)
        {
            _uow = uow;
            _seasonRepo = seasonRepo;
            _teamRepo = teamRepo;
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

        public HttpResponseMessage Post(IEnumerable<SeasonTeam> seasonTeams)
        {
            try
            {
                var newTeamIds =
                    (from st in seasonTeams
                     group st by st.SeasonId
                     into ts
                     select new
                                {
                                    seasonId = ts.Key,
                                    teamIds = ts.Select(t => t.TeamId).Distinct()
                                }
                    ).First().teamIds;

                var seasonId = seasonTeams.First().SeasonId;
                var season = _seasonRepo.Find(seasonId);

                var newTeams = newTeamIds.Select(id => _teamRepo.Find(id));
                season.Teams = season.Teams.Union(newTeams) as ICollection<Team>;

                _seasonRepo.Update(season);
                _uow.Commit();

                var response = Request.CreateResponse(HttpStatusCode.Created, season);

                return response;
            }
            catch (DomainValidationException dve)
            {
                return BadRequest(dve);
            }
        }

        [ActionName("remove")]
        public HttpResponseMessage Delete(Guid sId, Guid tId)
        {
            var season = _seasonRepo.Find(sId);
            var team = _teamRepo.Find(tId);

            season.Teams.Remove(team);
            _seasonRepo.Update(season);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}