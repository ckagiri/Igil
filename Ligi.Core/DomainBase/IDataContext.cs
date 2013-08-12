using System;
using System.Linq.Expressions;

namespace Ligi.Core.DomainBase
{
    public interface IDataContext<T> : IDisposable
        where T : IAggregateRoot
    {
        T Find(Guid id);
        T Find(Expression<Func<T, bool>> predicate);
        void Save(T aggregate);
    }
}
