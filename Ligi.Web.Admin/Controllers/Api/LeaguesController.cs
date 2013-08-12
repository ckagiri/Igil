using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;
using Ligi.Core.Validation;

namespace Ligi.Web.Admin.Controllers.Api
{
    public class LeaguesController : ApiControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly ILeagueRepository _leagueRepo;

        public LeaguesController(IUnitOfWork uow, ILeagueRepository leagueRepo)
        {
            _uow = uow;
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

        public HttpResponseMessage Post(League league)
        {
            try
            {
                var id = Guid.NewGuid();
                league.Id = id;
                _leagueRepo.Add(league);
                _uow.Commit();

                var response = Request.CreateResponse(HttpStatusCode.Created, league);

                //response.Headers.Location =
                //    new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = league.Id }));

                return response;
            }
            catch (DomainValidationException dve)
            {
                return BadRequest(dve);
            }
        }

        public HttpResponseMessage Put(League league)
        {
            _leagueRepo.Update(league);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        public HttpResponseMessage Delete(Guid id)
        {
            _leagueRepo.Delete(id);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}