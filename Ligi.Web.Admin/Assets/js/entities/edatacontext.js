LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    var self = this,
        leagues = new App.Entities.League(),
        seasons = new App.Entities.Season(),
        teams = new App.Entities.Team(),
        fixtures = new App.Entities.Fixture();
    
    Entities.DataContext = {
        leagues: App.Entities.Repository({
            collection: leagues}),
        seasons: App.Entities.Repository({
            collection: seasons
        }),
        teams: App.Entities.Repository({
            collection: teams
        }),
        fixtures: App.Entities.Repository({
            collection: fixtures
        })
    };
});