using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Ligi.Core.DataAccess;
using Ligi.Core.DomainBase;

namespace Ligi.Infrastructure.DataAccess
{
    public class MemoryRepository<T> : IRepository<T> where T : class, IEntity
    {
        public static ConcurrentDictionary<Guid, T> Repo = new ConcurrentDictionary<Guid, T>();

        public IEnumerable<T> FindAll
        {
            get { return Repo.Values.AsEnumerable(); }
        }

        public T Find(Guid id)
        {
            if (!Repo.ContainsKey(id))
            {
                return null;
            }

            T entity;
            var result = Repo.TryGetValue(id, out entity);
            return !result ? null : entity;
        }

        public void Add(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            var id = Guid.NewGuid();
            entity.Id = id;

            var result = Repo.TryAdd(id, entity);
        }

        public void Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            if (!Repo.ContainsKey(entity.Id))
            {
                return;
            }

            Repo[entity.Id] = entity;
        }

        public void Delete(Guid id)
        {
            if (!Repo.ContainsKey(id))
            {
                return;
            }

            T removed;
            var result = Repo.TryRemove(id, out removed);
        }

        public void Delete(T entity)
        {
            throw new NotImplementedException();
        }


        public T FirstOrDefault(Expression<Func<T, bool>> predicate = null)
        {
            throw new NotImplementedException();
        }

        public int Count(Expression<Func<T, bool>> predicate = null)
        {
            throw new NotImplementedException();
        }

        public bool Exists(Expression<Func<T, bool>> predicate = null)
        {
            throw new NotImplementedException();
        }

        public T Find(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        IEnumerable<T> IRepository<T>.FindAll(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }
    }
}