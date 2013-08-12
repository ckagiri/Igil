using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Web.Public.Controllers.Api
{
    public class LeaguesController : ApiControllerBase
    {
        private readonly ILeagueRepository _leagueRepo;

        public LeaguesController(ILeagueRepository leagueRepo)
        {
            _leagueRepo = leagueRepo;
        }

        public IEnumerable<League> Get()
        { 
            var leagues = _leagueRepo.FindAll();
            return leagues;
        }

        public League Get(Guid id)
        {
            var league = _leagueRepo.Find(id);
            if (league != null) return league;
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
        }

    }
}