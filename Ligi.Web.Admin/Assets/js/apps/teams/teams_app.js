LigiAdmin.module('TeamsApp', function (TeamsApp, LigiAdmin, Backbone, Marionette, $, _) {
    TeamsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "teams(?filter=:criterion)": "listTeams",
            "teams/:id": "showTeam",
            "teams/:id/edit": "editTeam"
        }
    });

    var API = {
        listTeams: function (criterion) {
            TeamsApp.List.Controller.listTeams(criterion);
            LigiAdmin.HeaderApp.List.Controller.setActiveHeader("teams");
        },
        showTeam: function (id) {
            TeamsApp.Show.Controller.showTeam(id);
            LigiAdmin.HeaderApp.List.Controller.setActiveHeader("teams");
        },
        editTeam: function (id) {
            TeamsApp.Edit.Controller.editTeam(id);
            LigiAdmin.HeaderApp.List.Controller.setActiveHeader("teams");
        }
    };

    LigiAdmin.on("teams:list", function () {
        LigiAdmin.navigate("teams");
        API.listTeams();
    });

    LigiAdmin.on("team:show", function(id) {
        LigiAdmin.navigate("teams/" + id);
        API.showTeam(id);
    });

    LigiAdmin.on("team:edit", function (id) {
        LigiAdmin.navigate("teams/" + id + "/edit");
        API.editTeam(id);
    });

    LigiAdmin.on("teams:filter", function (criterion) {
        if (criterion) {
            LigiAdmin.navigate("teams?filter=" + criterion);
        } else {
            LigiAdmin.navigate("teams");
        }
    });

    LigiAdmin.addInitializer(function() {
        return new TeamsApp.Router({
            controller: API
        });
    });
});