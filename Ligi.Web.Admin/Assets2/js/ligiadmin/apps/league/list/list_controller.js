LigiAdmin.module('LeagueApp.List', function (List, App, Backbone, Marionette, $, _) {
    List.Controller = App.Controllers.Base.extend({
        initialize: function() {
            var self = this,
                leagues = App.request("league:entities"),
                seasons = App.request("season:entities"),
                teams = App.request("team:entities"),
                seasonTeams = App.request("season:team:ids");
            App.execute("when:fetched", [leagues, seasons, teams, seasonTeams], function() {
                var x = seasons;
                var y = seasonTeams;
                debugger;
            });
        }
    });
})