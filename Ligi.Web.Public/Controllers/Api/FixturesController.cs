using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Web.Public.Controllers.Api
{
    public class FixturesController : ApiControllerBase
    {
        private readonly IFixtureRepository _fixtureRepo;

        public FixturesController(IFixtureRepository fixtureRepo)
        {
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
    }
}