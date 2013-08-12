using System;
using Ligi.Core.Events.Contracts;
using Ligi.Core.Utils;
using Ligi.Infrastructure.AspnetMembership;
using Ligi.Infrastructure.Database;
using Ligi.Infrastructure.Projections;
using Ligi.Infrastructure.ReadModel.Contracts;
using Ligi.Infrastructure.ReadModel.Impl;
using Xunit;

namespace Ligi.Infrastructure.Tests
{
    public class given_a_bookie_account_projection : given_a_read_model_database
    {
        protected BookieAccountProjection _Sut;
        protected IWeekAccountDao _Dao;
        protected IUserDao _uDao;

        public given_a_bookie_account_projection()
        {
            _Sut = new BookieAccountProjection(() => new BetsDbContext(dbName));
            _Dao = new WeekAccountDao(() => new BetsDbContext(dbName));
        }
    }

    public class given_an_account_opening : given_a_bookie_account_projection
    {
        protected WeekAccountOpened WeekAccountOpened;

        public given_an_account_opening()
        {
            System.Diagnostics.Trace.Listeners.Clear();

            WeekAccountOpened = new WeekAccountOpened
                                    {
                                        SourceId = Guid.NewGuid(),
                                        UserId = Guid.NewGuid(),
                                        SeasonId = Guid.NewGuid(),
                                        StartDate = new LigiWeek().FirstDayOfWeek(),
                                        EndDate = new LigiWeek().LastDayOfWeek(),
                                        Version = 1
                                    };

            _Sut.Handle(WeekAccountOpened);
        }

        [Fact]
        public void then_read_model_created()
        {
            var dtos = _Dao.GetWeekAccounts(WeekAccountOpened.UserId);

            Assert.NotNull(dtos);
            Assert.Equal(1, dtos.Count);
        }
    }
}
