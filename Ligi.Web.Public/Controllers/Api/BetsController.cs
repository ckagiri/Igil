using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using Ligi.Core.Commands.Contracts;
using Ligi.Core.Messaging;
using Ligi.Core.Model;
using Ligi.Infrastructure.ReadModel.Contracts;
using Bet = Ligi.Infrastructure.ReadModel.Bet;

namespace Ligi.Web.Public.Controllers.Api
{
    public class BetsController : ApiControllerBase
    {
        private readonly IBetsDao _betsDao;
        private readonly ICommandBus _commandBus;

        public BetsController(IBetsDao betsDao, ICommandBus commandBus)
        {
            _betsDao = betsDao;
            _commandBus = commandBus;
        }

        public List<Bet> GetBets()
        {
            var userId = GetUserId();
            var bets = _betsDao.GetBets(userId);
            return bets;
        }

        public List<Bet> GetBets(Guid seasonId)
        {
            var userId = GetUserId();
            var bets = _betsDao.GetBets(userId, seasonId);
            return bets;
        }

        public List<Bet> GetBets(Guid seasonId, DateTime startDate, DateTime endDate)
        {
            var userId = GetUserId();
            var bets = _betsDao.GetBets(userId, seasonId, startDate, endDate);
            return bets;
        }

        public HttpResponseMessage Post(Betslip betslip)
        {
            var userId = GetUserId();
            var timeStamp = DateTime.Now;
            var command = new SubmitBetslip
                              {
                                  UserId = userId,
                                  UserName = User.Identity.Name,
                                  SeasonId = betslip.SeasonId,
                                  Bets = betslip.BetItems.ToList(),
                                  TimeStamp = timeStamp
                              };
            _commandBus.Send(command);
            return  Request.CreateResponse(HttpStatusCode.Created, command);
        }
    }
}