LigiAdmin.module('LeagueApp.Edit', function (EditSeason, App, Backbone, Marionette, $, _) {
    EditSeason.Controller = App.Controllers.Base.extend({
        initialize: function (options) {
            var self = this;
            var id, season;
            season = options.season;
            id = options.id;
            season || (season = App.request("season:entity", id));
            App.execute("when:fetched", season, function () {
                var league = App.request("league:entity", season.get("leagueId"));
                App.execute("when:fetched", league, function () {
                    season.league = league;
                    
                    debugger;
                });
                
            });
        }
    });
});