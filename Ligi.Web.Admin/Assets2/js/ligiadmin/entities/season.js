LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    Entities.Season = Entities.Model.extend({
        urlRoot: "/api/seasons",
        
        league: function () {
            var league = App.request("league:entity", this.get('leagueId'));
            return league;
        }
    });

    Entities.SeasonCollection = Entities.Collection.extend({
        url: "/api/seasons",
        model: Entities.Season,
        comparator: "name"
    });
    
    var API = {
        getSeasons: function () {
            var seasons;
            seasons = new Entities.SeasonCollection();
            seasons.fetch({ reset: true });
            return seasons;
        },
        getSeason: function (id) {
            var season;
            season = new Entities.Season({ id: id });
            season.fetch();
            return season;
        },
        newSeason: function () {
            var season = new Entities.Season();
            return season;
        }
    };
    
    App.reqres.setHandler("season:entities", function () {
        return API.getSeasons();
    });
    
    App.reqres.setHandler("season:entity", function (id) {
        return API.getSeason(id);
    });
    
    App.reqres.setHandler("new:season:entity", function () {
        return API.newSeason();
    });
});