using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Web.Public.Controllers.Api
{
    public class SeasonsController : ApiControllerBase
    {
        private readonly ISeasonRepository _seasonRepo;

        public SeasonsController(ISeasonRepository seasonRepo)
        {
            _seasonRepo = seasonRepo;
        }

        public IEnumerable<Season> Get()
        {
            var seasons = _seasonRepo.FindAll();
            return seasons;
        }

        public Season Get(Guid id)
        {
            var season = _seasonRepo.Find(id);
            if (season != null) return season;
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
        }
    }
}