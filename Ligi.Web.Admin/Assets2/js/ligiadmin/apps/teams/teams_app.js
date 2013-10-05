LigiAdmin.module('TeamsApp', function (TeamsApp, App, Backbone, Marionette, $, _) {
    TeamsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "teams": "list"
        }
    });
    
    var API = {
        list: function () {
            TeamsApp.List.Controller.list();
        },
        newTeam: function () {
            return TeamsApp.New.Controller.newTeam();
        }
    };

    App.reqres.setHandler("new:team:view", function () {
        return API.newTeam();
    });
    
    App.addInitializer(function () {
        return new TeamsApp.Router({
            controller: API
        });
    });
});