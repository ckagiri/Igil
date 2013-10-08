LigiAdmin.module('TeamsApp', function (TeamsApp, App, Backbone, Marionette, $, _) {
    TeamsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "teams": "list",
            //"teams/:id": "show",
            "teams/:id/edit": "edit"
        }
    });
    
    var API = {
        list: function () {
            return new TeamsApp.List.Controller();
        },
        newTeam: function () {
            return TeamsApp.New.Controller.newTeam();
        },
        edit: function (id, team) {
            TeamsApp.Edit.Controller.edit(id,team);
        }
    };

    App.reqres.setHandler("new:team:view", function () {
        return API.newTeam();
    });

    App.vent.on("team:clicked", function (team) {
        App.navigate("teams/" + team.id + "/edit");
        API.edit(team.id, team);
    });
    
    App.vent.on("team:cancelled team:updated", function (team) {
        App.navigate("teams");
        API.list();
    });
    
    App.addInitializer(function () {
        return new TeamsApp.Router({
            controller: API
        });
    });
});