using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Events.Contracts;
using Ligi.Core.Messaging;
using Ligi.Core.Model;
using Ligi.Core.Utils;
using Ligi.Core.Validation;
using Ligi.Web.Admin.App_Start;
using Microsoft.AspNet.SignalR.Client.Hubs;

namespace Ligi.Web.Admin.Controllers.Api
{
    public class FixturesController : ApiControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IFixtureRepository _fixtureRepo;
        private IEventBus _eventBus;

        private IEventBus EventBus
        {
            get
            {
                return _eventBus ?? (_eventBus = WebApiApplication.EventBus);
            }
        }

        public FixturesController(IUnitOfWork uow, IFixtureRepository fixtureRepo)
        {
            _uow = uow;
            _fixtureRepo = fixtureRepo;
        }

        public IEnumerable<Fixture> Get()
        {
            var fixtures = _fixtureRepo.FindAll();
            return fixtures;
        }

        public Fixture Get(Guid id)
        {
            var fixture = _fixtureRepo.Find(id);
            if (fixture != null) return fixture;
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
        }

        public async Task<HttpResponseMessage> Post(Fixture fixture)
        {
            try
            {
                var id = Guid.NewGuid();
                fixture.Id = id;
                fixture.StartOfWeek = new LigiWeek(fixture.KickOff).Start();
                fixture.EndOfWeek = new LigiWeek(fixture.KickOff).End();
                _fixtureRepo.Add(fixture);
                _uow.Commit();

                var response = Request.CreateResponse(HttpStatusCode.Created, fixture);

                response.Headers.Location =
                    new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = fixture.Id }));

                await UpsertFixture(fixture);

                return response;
            }
            catch (DomainValidationException dve)
            {
                return BadRequest(dve);
            }
        }

        public async Task<HttpResponseMessage> Put(Fixture fixture)
        {
            try
            {
                var existing = _fixtureRepo.Find(n => n.Id == fixture.Id);
                if (existing == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Fixture not found");
                }
                var matchResultConfirmed = !existing.MatchResultConfirmed && fixture.MatchStatus == MatchStatus.Played;
                if (matchResultConfirmed)
                {
                    fixture.MatchResultConfirmed = true;
                }

                _fixtureRepo.Update(existing, fixture);
                _uow.Commit();

                try
                {
                    if (matchResultConfirmed)
                    {
                        EventBus.Publish(new MatchResultConfirmed
                                             {
                                                 SourceId = fixture.Id,
                                                 FixtureId = fixture.Id,
                                                 AwayScore = fixture.AwayScore,
                                                 HomeScore = fixture.HomeScore,
                                                 MatchStatus = fixture.MatchStatus
                                             });
                    }
                }
                catch (Exception ex)
                {
                    Trace.TraceError(ex.Message);
                }

                await UpsertFixture(fixture);

                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
            catch (DomainValidationException dve)
            {
                return BadRequest(dve);
            }
        }

        public async Task<HttpResponseMessage> Delete(Guid id)
        {
            _fixtureRepo.Delete(id);
            _uow.Commit();

            await RemoveFixture(id);

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        private async Task UpsertFixture(Fixture fixture)
        {
            try
            {
                var hubConnection = new HubConnection("http://localhost:52076/");

                IHubProxy hub = hubConnection.CreateHubProxy("ligi");

                await hubConnection.Start();
                await hub.Invoke<Fixture>("UpsertFixture", fixture);
            }
            catch (Exception ex)
            {
                Trace.TraceError(ex.Message);
            }
        }

        private async Task RemoveFixture(Guid fixtureId)
        {
            try
            {
                var hubConnection = new HubConnection("http://localhost:52076/");

                IHubProxy hub = hubConnection.CreateHubProxy("ligi");

                await hubConnection.Start();
                await hub.Invoke<Guid>("RemoveFixture", fixtureId);
            }
            catch (Exception ex)
            {
                Trace.TraceError(ex.Message);
            }
        }
    }
}