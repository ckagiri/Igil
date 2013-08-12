using System.Web.Optimization;

namespace Ligi.Web.Public.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
             //Force optimization to be on or off, regardless of web.config setting
            BundleTable.EnableOptimizations = false;
            bundles.UseCdn = false;

            bundles.IgnoreList.Clear();
            bundles.IgnoreList.Ignore("*-vsdoc.js");
            bundles.IgnoreList.Ignore("*intellisense.js");

            bundles.Add(new ScriptBundle("~/bundles/modernizr")
                .Include("~/Scripts/lib/modernizr-{version}.js"));

             //jQuery
            bundles.Add(new ScriptBundle("~/bundles/jquery", 
                "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js")
                .Include("~/Scripts/lib/jquery-{version}.js"));

            //underscore
            bundles.Add(new ScriptBundle("~/bundles/underscore")
                .Include("~/Scripts/lib/underscore.js"));

             //3rd Party JavaScript files
            bundles.Add(new ScriptBundle("~/bundles/jsextlibs")
                .IncludeDirectory("~/Scripts/lib", "*.js", searchSubdirectories: false)
                .Include(
                    "~/Scripts/lib/json2.js", // IE7 needs this

                     //jQuery plugins
                    "~/Scripts/lib/activity-indicator.js",
                    "~/Scripts/lib/jquery.mockjson.js",
                    "~/Scripts/lib/TrafficCop.js",
                    "~/Scripts/lib/infuser.js", // depends on TrafficCop

                     //Knockout and its plugins
                    "~/Scripts/lib/knockout-{version}.js",
                    "~/Scripts/lib/knockout.activity.js",
                    "~/Scripts/lib/knockout.asyncCommand.js",
                    "~/Scripts/lib/knockout.dirtyFlag.js",
                    "~/Scripts/lib/knockout.validation.js",
                    "~/Scripts/lib/koExternalTemplateEngine.js",
                    
                     //Other 3rd party libraries
                    "~/Scripts/lib/postal.js",
                    "~/Scripts/lib/moment.js",
                    "~/Scripts/lib/sammy.*",
                    "~/Scripts/lib/amplify.*",
                    "~/Scripts/lib/toastr.js"
                    ));

            bundles.Add(new ScriptBundle("~/bundles/jsapplibs")
                .IncludeDirectory("~/Scripts/app/", "*.js", searchSubdirectories: false));

            bundles.Add(new ScriptBundle("~/bundles/jskobootstrap")
                .IncludeDirectory("~/Content/js/ext", "*.js", searchSubdirectories: false));

            bundles.Add(new ScriptBundle("~/Content/js")
                .IncludeDirectory("~/Content/js/", "*.js", searchSubdirectories: false));

            bundles.Add(
                new StyleBundle("~/Content/css")
                    .Include("~/Content/css/ie10mobile.css") // Must be first. IE10 mobile viewport fix
                    .Include("~/Content/css/font-awesome.min.css")
                    .Include("~/Content/css/bootstrap.min.css")
                    .Include("~/Content/css/bootstrap-responsive.min.css")
                    .Include("~/Content/css/durandal.css")
                    .Include("~/Content/css/toastr.css")
                    //.Include("~/Content/css/styles.css")
                    .Include("~/Content/css/datepicker.css")
                    .Include("~/Content/css/main.css"));
        }
    }
}