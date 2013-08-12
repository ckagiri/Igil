using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;
using Ligi.Infrastructure.Database;

namespace Ligi.Infrastructure.DataAccess
{
    public class FixtureBookiesDao : IFixtureBookiesDao
    {
        private readonly Func<IndexDictionaryDbContext> _contextFactory;

        public FixtureBookiesDao(Func<IndexDictionaryDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public List<Guid> GetBookies(Guid fixtureId)
        {
            using (var context = _contextFactory())
            {
                var bookies = context.Query<FixtureBookieIndex>().Where(n => n.FixtureId == fixtureId)
                    .Select(n => n.BookieId).ToList();
                return bookies;
            }
        }
    }
}
