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
    public class SeasonsController : ApiControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly ISeasonRepository _seasonRepo;

        public SeasonsController(IUnitOfWork uow, ISeasonRepository seasonRepo)
        {
            _uow = uow;
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

        //[ActionName("getbyleagueid")]
        //public IEnumerable<Season> GetByLeagueId(int id)
        //{
        //    var seasons = _seasonRepo.GetByLeagueId(id);
        //    return seasons;
        //}

        public HttpResponseMessage Post(Season season)
        {
            try
            {
                var id = Guid.NewGuid();
                season.Id = id;
                _seasonRepo.Add(season);
                _uow.Commit();

                var response = Request.CreateResponse(HttpStatusCode.Created, season);

                //response.Headers.Location =
                //    new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = season.Id }));

                return response;
            }
            catch (DomainValidationException dve)
            {
                return BadRequest(dve);
            }
        }

        public HttpResponseMessage Put(Season season)
        {
            _seasonRepo.Update(season);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        public HttpResponseMessage Delete(Guid id)
        {
            _seasonRepo.Delete(id);
            _uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}