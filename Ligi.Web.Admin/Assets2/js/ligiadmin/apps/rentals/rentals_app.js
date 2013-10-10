LigiAdmin.module('RentalsApp', function (RentalsApp, App, Backbone, Marionette, $, _) {
    RentalsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "rentals": "list"
        }
    });

    var API = {
        list: function () {
            return new RentalsApp.List.Controller();
        }
    };

    App.addInitializer(function () {
        return new RentalsApp.Router({
            controller: API
        });
    });
});