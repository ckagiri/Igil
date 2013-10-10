LigiAdmin.module('SearchApp', function (SearchApp, App, Backbone, Marionette, $, _) {
    SearchApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "search": "list"
        }
    });

    var API = {
        list: function () {
            return new SearchApp.List.Controller();
        }
    };

    App.addInitializer(function () {
        return new SearchApp.Router({
            controller: API
        });
    });
});