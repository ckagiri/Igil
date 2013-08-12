using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Security;
using Ligi.Core.DataAccess;
using Ligi.Core.Utils;
using Ligi.Infrastructure.ReadModel;
using Ligi.Infrastructure.ReadModel.Contracts;

namespace Ligi.Web.Public.Controllers.Api
{
    public class LookupsController : ApiControllerBase
    {
        private readonly ISeasonRepository  _seasonRepository;
        private readonly IWeekAccountDao _weekAccountDao;

        public LookupsController(ISeasonRepository seasonRepository, IWeekAccountDao weekAccountDao)
        {
            _seasonRepository = seasonRepository;
            _weekAccountDao = weekAccountDao;
        }

        // GET: api/lookups/currentweek
        [ActionName("currentweek")]
        public WeekRange GetCurrentWeek()
        {
            var ligiWeek = new LigiWeek(DateTime.Now);
            var week = new WeekRange
                           {
                               StartDate = ligiWeek.Start(),
                               EndDate = ligiWeek.End()
                           };
            return week;
        }

        // GET: api/lookups/seasonweeks
        [ActionName("seasonweeks")]
        public List<WeekRange> GetSeasonWeeks(Guid seasonId)
        {
            List<WeekRange> weeks;
            var season = _seasonRepository.Find(seasonId);
            if (season != null)
            {
                var ligiWeeks = new LigiWeeks(season.StartDate.Date, season.EndDate.Date);
                weeks = ligiWeeks.GetWeeks();
                return weeks;
            }
            else
            {
                weeks = new List<WeekRange>();
                return weeks;
            }
        }

        // GET: api/lookups/weekaccount
        [ActionName("weekaccount")]
        public WeekAccount GetWeekAccount(DateTime startDate, DateTime endDate)
        {
            var userId = GetUserId();
            var weekAccount = _weekAccountDao.GetWeekAccount(userId, startDate.Date, endDate.Date);

            if (weekAccount == null)
            {
                weekAccount = new WeekAccount(startDate, endDate);
            }

            return weekAccount;
        }

        // GET: api/lookups/monthweeks
        [ActionName("monthweeks")]
        public List<WeekRange> GetMonthWeeks(int year, int month)
        {
            var ligiWeeks = new LigiWeeks(year, month).GetWeeks();
            return ligiWeeks;
        }
    }
}