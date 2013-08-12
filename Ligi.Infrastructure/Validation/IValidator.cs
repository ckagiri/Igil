using System.Collections.Generic;
using System.Data.Entity;
using Ligi.Core.DataAccess;
using Ligi.Core.Validation;

namespace Ligi.Infrastructure.Validation
{
    public interface IValidator<in T> where T : class
    {
        ValidationResultInfo Validate(T entity, DbContext context);
    }
}
