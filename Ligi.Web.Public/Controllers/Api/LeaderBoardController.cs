using System;
using System.Collections.Generic;
using System.Web.Http;
using Ligi.Infrastructure.ReadModel;
using Ligi.Infrastructure.ReadModel.Contracts;

namespace Ligi.Web.Public.Controllers.Api
{
    public class LeaderBoardController : ApiControllerBase
    {
        private readonly ILeaderBoardDao _leaderBoardDao;

        public LeaderBoardController(ILeaderBoardDao leaderBoardDao)
        {
            _leaderBoardDao = leaderBoardDao;
        }

        // GET: api/leaderboard/weekleaderboard
        [ActionName("weekleaderboard")]
        public List<WeekAccount> GetWeekLeaderBoard(Guid seasonId, DateTime startDate, DateTime endDate)
        {
            var weekEntries = _leaderBoardDao.GetWeekEntries(seasonId, startDate.Date, endDate.Date);

            return weekEntries;
        }

        // GET: api/leaderboard/monthleaderboard
        [ActionName("monthleaderboard")]
        public List<MonthLeaderBoard> GetMonthLeaderBoard(Guid seasonId, int month)
        {
            var monthEntries = _leaderBoardDao.GetMonthEntries(seasonId, month);

            return monthEntries;
        }

        // GET: api/leaderboard/seasonleaderboard
        [ActionName("seasonleaderboard")]
        public List<SeasonLeaderBoard> GetSeasonLeaderBoard(Guid seasonId)
        {
            var seasonEntries = _leaderBoardDao.GetSeasonEntries(seasonId);

            return seasonEntries;
        }
    }
}