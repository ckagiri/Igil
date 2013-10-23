LigiAdmin.module('LeagueApp', function (LeagueApp, App, Backbone, Marionette, $, _) {
    LeagueApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "league": "list",
            //"league/:id": "show",
            "league/:id/edit": "edit"
        }
    });
    
    var API = {
        list: function () {
            return new LeagueApp.List.Controller();
        },
        edit: function (id) {
            return new LeagueApp.Edit.Controller({
                id: id
            });
        }
    };

   App.addInitializer(function () {
        return new LeagueApp.Router({
            controller: API
        });
    });
});