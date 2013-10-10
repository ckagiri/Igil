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
        newTeam: function (region) {
            return new TeamsApp.New.Controller({
                region: region
            });
        },
        edit: function (id, team, region) {
            return new TeamsApp.Edit.Controller({
                id: id,
                team: team,
                region: region
            });
        }
    };

    App.commands.setHandler("new:team", function (region) {
        API.newTeam(region);
    });

    App.vent.on("team:clicked", function (team) {
        App.navigate("teams/" + team.id + "/edit");
        API.edit(team.id, team);
    });
    
    App.commands.setHandler("edit:team:dialog", function (team) {
        API.edit(team.id, team, App.dialogRegion);
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