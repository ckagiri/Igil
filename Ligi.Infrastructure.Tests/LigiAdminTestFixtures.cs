using System;
using System.Collections.Generic;
using System.Linq;
using Itenso.TimePeriod;
using Ligi.Core.Model;
using Ligi.Core.Utils;
using Ligi.Infrastructure.AspnetMembership;
using Ligi.Infrastructure.DataAccess;
using NUnit.Framework;

namespace Ligi.Infrastructure.Tests
{
    [TestFixture]
    public class LigiAdminTestFixtures
    {
        [Test]
        public void can_add_league()
        {
            var uow = new AdminUnitOfWork();
            var epl = new League
                                 {
                                     Id = Guid.NewGuid(),
                                     Code = "EPL",
                                     Name = "English Premier League"
                                 };
            var bundesliga = new League
            {
                Id = Guid.NewGuid(),
                Code = "BLG",
                Name = "Bundesliga"
            };
            var leagueRepo = new LeagueRepository(uow);
            leagueRepo.Add(epl);
            leagueRepo.Add(bundesliga);
            uow.Commit();

            //var lig = leagueRepo.FirstOrDefault();
        }

        [Test]
        public void can_add_season()
        {
            var uow = new AdminUnitOfWork();
            //var membership = new AspnetDbContext();
            var leagueRepo = new LeagueRepository(uow);
            var seasonRepo = new SeasonRepository(uow);
            //var usrs = membership.Users.ToList();
            var lig = leagueRepo.FirstOrDefault();
            ////var ssn1 = new Season
            ////               {
            ////                   Id = Guid.NewGuid(),
            ////                   StartDate = DateTime.Now,
            ////                   EndDate = DateTime.Now.AddMonths(9),
            ////                   LeagueId = lig.Id,
            ////                   Name = "Season 1"
            ////               };

            ////seasonRepo.Add(ssn1);

            //uow.Commit();

            var ssn1_ = seasonRepo.FindAll(s => s.LeagueId == lig.Id);
        }

        [Test]
        public void can_add_team_to_season()
        {
            var uow = new AdminUnitOfWork();
            var teamRepo = new TeamRepository(uow);
            var seasonRepo = new SeasonRepository(uow);
            var ssn = seasonRepo.FirstOrDefault();
            var manu = new Team
            {
                Id = Guid.NewGuid(),
                Name = "Manchester United",
                HomeGround = "Old Trafford"
            };
            var chel = new Team
            {
                Id = Guid.NewGuid(),
                Name = "Chelsea",
                HomeGround = "Stamford Bridge"
            };
            teamRepo.Add(manu);
            teamRepo.Add(chel);

            teamRepo.Save();

            ssn.Teams.Add(manu);
            ssn.Teams.Add(chel);

            uow.Commit();

            var ssn1_ = seasonRepo.FindAll(s => s.LeagueId == ssn.LeagueId);
        }

        [Test]
        public void gets_correct_week_range()
        {
            var date1 = DateTime.Now;
            
            var week = new LigiWeek(date1);
            //var week2 = week.AddWeeks(-1).;
            var x = week.Start().Date;
            var y = week.End().Date;
            var x2 = x.AddDays(7);
            var y2 = y.AddDays(7);
            var a = x.Date;
            var b = y.Date;
        }

        [Test]
        public void get_em()
        {
            var day1 = new LigiWeek().Start().AddDays(2);
            var day2 = new LigiWeek().Start().AddDays(5);
            var day3 = day1.AddDays(7);
            var day4 = day1.AddDays(14);
            var day5 = day2.AddDays(14);
            var eplFixtures = new List<Fixture>
                                  {
                                      new Fixture
                                          {
                                              Id = Guid.NewGuid(),
                                              KickOff = day1,
                                              StartOfWeek = new LigiWeek(day1).Start(),
                                              EndOfWeek = new LigiWeek(day1).End(),
                                              HomeAsianHandicap = 1,
                                              AwayAsianHandicap = -1,
                                              TotalGoalsHandicap = 3,
                                          },
                                      new Fixture
                                          {
                                              Id = Guid.NewGuid(),
                                              KickOff = day1,
                                              StartOfWeek = new LigiWeek(day1).Start(),
                                              EndOfWeek = new LigiWeek(day1).End(),
                                              HomeAsianHandicap = -1.25m,
                                              AwayAsianHandicap = 1.25m,
                                              TotalGoalsHandicap = 2.5m,
                                              HomeScore = 2,
                                              AwayScore = 3,
                                              MatchStatus = MatchStatus.Played
                                          },
                                      new Fixture
                                          {
                                              Id = Guid.NewGuid(),
                                              KickOff = day2,
                                              StartOfWeek = new LigiWeek(day2).Start(),
                                              EndOfWeek = new LigiWeek(day2).End(),
                                              HomeAsianHandicap = 1.5m,
                                              AwayAsianHandicap = -1.5m,
                                              TotalGoalsHandicap = 2,
                                              HomeScore = 2,
                                              AwayScore = 3,
                                              MatchStatus = MatchStatus.Played
                                          },
                                      new Fixture
                                          {
                                              Id = Guid.NewGuid(),
                                              KickOff = day2,
                                              StartOfWeek = new LigiWeek(day2).Start(),
                                              EndOfWeek = new LigiWeek(day2).End(),
                                              HomeAsianHandicap = 1,
                                              AwayAsianHandicap = -1,
                                              TotalGoalsHandicap = 2.25m
                                          },
                                      new Fixture
                                          {
                                              Id = Guid.NewGuid(),
                                              KickOff = day3,
                                              StartOfWeek = new LigiWeek(day3).Start(),
                                              EndOfWeek = new LigiWeek(day3).End(),
                                              HomeScore = 1,
                                              AwayScore = 1,
                                              MatchStatus = MatchStatus.Played

                                          }
                                  };
            var t = DateTime.Now;
            var f = eplFixtures;
        }

        [Test]
        public void can_get_weeks()
        {
            //var weeks = new LigiWeeks(2013, 9).GetWeeks();
            var day = new LigiWeek(new DateTime(2013, 1, 1)).Start();

            var day2 = new Week(2013, 1).GetPreviousWeek().GetNextWeek();

        }
    }
}
