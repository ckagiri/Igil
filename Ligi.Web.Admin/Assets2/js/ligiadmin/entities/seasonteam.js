LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    Entities.SeasonTeam = Entities.Model.extend({
        urlRoot: "/api/seasonteams",
        
        league: function () {
            var league = App.request("league:entity", this.get('leagueId'));
            return league;
        }
    });

    Entities.SeasonTeamCollection = Entities.Collection.extend({
        url: "/api/seasonteams",
        model: Entities.SeasonTeam,
    });
    
    var seasonteams;
    
    var API = {
        getSeasonTeams: function () {
            if (!seasonteams) {
                seasonteams = new Entities.SeasonTeamCollection();
                seasonteams.fetch({ reset: true });
            }
            return seasonteams;
        },
        getTeamsBySeason: function (seasonId) {
            var teamIds, teams;
            teamIds = seasonteams.chain()
                .filter(function (st) {
                    return st.get('seasonId') === seasonId;
                }).map(function(st) {//
                    return st.get('teamId');
                }).value();//;
            teams = (App.request("team:entities"))
                .filter(function(t) {
                    return _.contains(teamIds, t.get('id'));
                });
            return new Entities.TeamCollection().add(teams);
        },
        newSeasonTeam: function () {
            var season = new Entities.SeasonTeam();
            return season;
        }
    };
    
    App.reqres.setHandler("season:team:ids", function () {
        return API.getSeasonTeams();
    });
    
    App.reqres.setHandler("team:entities:seasonId", function (seasonId) {
        return API.getTeamsBySeason(seasonId);
    });
    
    App.reqres.setHandler("new:season:team", function () {
        return API.newSeasonTeam();
    });
});