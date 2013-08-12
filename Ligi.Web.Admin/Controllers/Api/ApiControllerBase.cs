using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ligi.Core.Validation;

namespace Ligi.Web.Admin.Controllers.Api
{
    public abstract class ApiControllerBase : ApiController
    {
        protected HttpResponseMessage BadRequest(DomainValidationException dve)
        {
            var errors = dve.ValidationResults.Results.Aggregate("Error: Invalid target fields.\n",
                                                     (current, msg) =>
                                                     current + ("- " + msg.ErrorMessage + "\n"));
            var response = Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            return response;
        }
    }
}