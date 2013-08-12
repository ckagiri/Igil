using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Security;
using Ligi.Core.Validation;
using Ligi.Web.Public.Hubs;
using Microsoft.AspNet.SignalR;

namespace Ligi.Web.Public.Controllers.Api
{
    public abstract class ApiControllerBase : ApiController
    {
        protected Guid GetUserId()
        {
            Guid userId;
            var membershipUser = Membership.GetUser(User.Identity.Name, true /* userIsOnline */);
            if (membershipUser == null || membershipUser.ProviderUserKey == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
            }
            Guid.TryParse(membershipUser.ProviderUserKey.ToString(), out userId);

            return userId;
        }

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