LigiAdmin.module('DashboardTheatresApp', function (DashboardTheatresApp, App, Backbone, Marionette, $, _) {
    var API = {
        list: function (region) {
            return new DashboardTheatresApp.List.Controller({
                region: region
            });
        }
    };

    App.commands.setHandler("list:dashboard:theatre:movies", function (region) {
        API.list(region);
    });
});