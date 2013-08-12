using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

// ReSharper disable RedundantArgumentName

namespace Ligi.Web.Admin.App_Start
{
    public class RouteConfig
    {
        public static string ControllerOnly = "ApiControllerOnly";
        public static string ControllerAndId = "ApiControllerAndGuidId";
        public static string ControllerAction = "ApiControllerAction";
        
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // This controller-per-type route is ideal for GetAll calls.
            // It finds the method on the controller using WebAPI conventions
            // The template has no parameters.

            routes.MapHttpRoute(
                name: ControllerOnly,
                routeTemplate: "api/{controller}"
            );

            // This is the default route that a "File | New MVC 4 " project creates.
            // (I changed the name, removed the defaults, and added the constraints)
            //
            // This controller-per-type route lets us fetch a single resource by numeric id
            // It finds the appropriate method GetById method
            // on the controller using WebAPI conventions
            // The {id} is not optional, must be an integer, and 
            // must match a method with a parameter named "id" (case insensitive)
            //
            //  ex: api/sessions/1
            //  ex: api/persons/1
            routes.MapHttpRoute(
                name: ControllerAndId,
                routeTemplate: "api/{controller}/{id}",
                defaults: null, //defaults: new { id = RouteParameter.Optional } //,
                constraints: new
                                 {
                                     id = @"^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9‌​a-fA-F]{12}(\}){0,1}$"
                                 }
            );

            /********************************************************
            * The integer id constraint is necessary to distinguish 
            * the {id} route above from the {action} route below.
            * For example, the route above handles
            *     "api/sessions/1" 
            * whereas the route below handles
            *     "api/lookups/all"
            ********************************************************/

            // This RPC style route is great for lookups and custom calls
            // It matches the {action} to a method on the controller 
            //
            // ex: api/lookups/all
            routes.MapHttpRoute(
                name: ControllerAction,
                routeTemplate: "api/{controller}/{action}"
            );

            // wont be using MVC views
            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);
        }
    }
}