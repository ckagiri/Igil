LigiAdmin.module('DashboardUpcomingApp', function (DashboardUpcomingApp, App, Backbone, Marionette, $, _) {
    var API = {
        list: function (region) {
            return new DashboardUpcomingApp.List.Controller({
                region: region
            });
        }
    };

    App.commands.setHandler("list:dashboard:upcoming:movies", function (region) {
        API.list(region);
    });
});