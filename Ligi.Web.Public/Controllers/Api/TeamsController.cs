using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Web.Public.Controllers.Api
{
    public class TeamsController : ApiControllerBase
    {
        private readonly ITeamRepository _teamRepo;

        public TeamsController(ITeamRepository teamRepo)
        {
            _teamRepo = teamRepo;
        }

        public IEnumerable<Team> Get()
        {
            var teams = _teamRepo.FindAll();
            return teams;
        }

        public Team Get(Guid id)
        {
            var team = _teamRepo.Find(id);
            if (team != null) return team;
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
        }
    }
}