﻿using System;
using System.Threading.Tasks;
using Ligi.Core.DataAccess;
using Ligi.Core.Model;

namespace Ligi.Infrastructure.DataAccess
{
    public class FixtureRepository : RepositoryBase<Fixture>, IFixtureRepository
    {
        public FixtureRepository(IUnitOfWork uow) : base(uow)
        { }

        public async Task<Fixture> FindAsync(Guid id)
        {
            var fixture =  await Task.Factory.StartNew(() => DbSet.Find(id));
            return fixture;
        }

        public void Update(Fixture existing, Fixture update)
        {
            DbContext.Entry(existing).CurrentValues.SetValues(update);
        }
    }
}
