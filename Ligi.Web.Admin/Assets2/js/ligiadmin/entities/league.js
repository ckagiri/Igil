LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    Entities.League = Entities.Model.extend({
        urlRoot: "/api/leagues"
    });

    //Entities.configureStorage(Entities.League);

    Entities.LeagueCollection = Entities.Collection.extend({
        url: "/api/leagues",
        model: Entities.League,
        comparator: "name"
    });

    //Entities.configureStorage(Entities.LeagueCollection);
    var leagues;

    var API = {
        getLeagues: function () {
            if (!leagues) {
                leagues = new Entities.LeagueCollection();
                leagues.fetch({ reset: true });
            }
            return leagues;
        },
        getLeague: function (id) {
            var league;
            if(leagues) {
                league = leagues.get(id);
            }
            if (league == null) {
                league = new Entities.League({ id: id });
                league.fetch();
            }
            return league;
        },
        newLeague: function () {
            var league = new Entities.League();
            return league;
        }
    };
    
    App.reqres.setHandler("league:entities", function () {
        return API.getLeagues();
    });
    
    App.reqres.setHandler("league:entity", function (id) {
        return API.getLeague(id);
    });
   
    App.reqres.setHandler("new:league:entity", function () {
        return API.newLeague();
    });
});