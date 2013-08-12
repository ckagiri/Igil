using System.Data.Entity;

namespace Ligi.Infrastructure.AspnetMembership
{
    public class AspnetDbInitializer : 
        CreateDatabaseIfNotExists<AspnetDbContext>
    {
    }
}
