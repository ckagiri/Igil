using System;
using System.Threading.Tasks;
using Ligi.Core.Model;

namespace Ligi.Core.DataAccess
{
    public interface IFixtureRepository : IRepository<Fixture>
    {
        Task<Fixture> FindAsync(Guid id);
        void Update(Fixture existing, Fixture update);
    }
}
