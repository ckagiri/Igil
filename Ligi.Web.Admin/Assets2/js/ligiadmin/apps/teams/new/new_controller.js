LigiAdmin.module('TeamsApp.New', function (New, App, Backbone, Marionette, $, _) {
    New.Controller = {
        newTeam: function () {
            var team, newView;
            team = App.request("new:team:entity");
            
            // team.on("created",func(){})
            
            newView = this.getNewView(team);
            return App.request("form:wrapper", newView);
        },
        
        getNewView: function (team) {
            return new New.Team({
                model: team
            });
        }
    };
});
