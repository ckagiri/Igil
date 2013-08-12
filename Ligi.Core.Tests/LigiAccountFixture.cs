using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ligi.Core.Commands.Contracts;
using Ligi.Core.Handlers;
using Ligi.Core.Model;
using Xunit;

namespace Ligi.Core.Tests
{
    public class given_no_bets_processed
    {
        private static readonly Guid SeasonId = Guid.NewGuid();
        private static readonly Guid BookieId = Guid.NewGuid();
        private static readonly DateTime now = DateTime.Now;
        private Bet _bet1 = new Bet
                       {
                           FixtureId = Guid.NewGuid(),
                           BetType = BetType.HangCheng,
                           BetPick = BetPick.Away,
                           Handicap = 1.5m,
                           Wager = 200,
                           Stake = 200,
                           TimeStamp = now
                       };
        private Bet _bet2 = new Bet
                       {
                           FixtureId = Guid.NewGuid(),
                           BetType = BetType.TotalGoals,
                           BetPick = BetPick.Over,
                           Handicap = 1.5m,
                           Wager = 200,
                           Stake = 200,
                           TimeStamp = now
                       };
        private readonly EventSourcingTestHelper<LigiAccount> _sut;

        public given_no_bets_processed()
        {
            _sut = new EventSourcingTestHelper<LigiAccount>();
            _sut.Setup(new LigiAccountCommandHandler(_sut.Repository));
        }

        [Fact]
        public void when_update_ligi_account_is_issued_updates_respective_fixture_accounts()
        {
            _sut.When(new UpdateLigiAccount
                          {
                              SeasonId = SeasonId,
                              BookieId = BookieId,
                              BetTransactions = new List<BetTransaction>()
                                                    {
                                                        new BetTransaction
                                                            {
                                                                TxType = TransactionType.New,
                                                                Bet = _bet1
                                                            },
                                                        new BetTransaction
                                                            {
                                                                TxType = TransactionType.New,
                                                                Bet = _bet2
                                                            }
                                                    }
                          });
            Assert.Equal(2, _sut.Events.Count);
        } 
    }
}
