using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;
using Ligi.Web.Admin.App_Start;
using Microsoft.AspNet.SignalR.Client.Hubs;

namespace Ligi.Web.Admin.Controllers.Api
{
    public class TeamsController : ApiControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly ITeamRepository _teamRepo;
        private readonly HttpClient _httpClient;

        public TeamsController(IUnitOfWork uow, ITeamRepository teamRepo)
        {
            _uow = uow;
            _teamRepo = teamRepo;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("http://localhost:52076/")
            };
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

        public HttpResponseMessage Post(Team team)
        {
            var id = Guid.NewGuid();
            team.Id = id;
            _teamRepo.Add(team);
            _uow.Commit();

            var response = Request.CreateResponse(HttpStatusCode.Created, team);

            response.Headers.Location =
                new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = team.Id }));

            return response;
        }

        public HttpResponseMessage Put(Team team)
        {
            _teamRepo.Update(team);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        public HttpResponseMessage Delete(Guid id)
        {
            _teamRepo.Delete(id);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}