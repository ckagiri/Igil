LigiAdmin.module('Entities', function (Entities, LigiAdmin, Backbone, Marionette, $, _) {
    Entities.League = Backbone.Model.extend({
        urlRoot: "/api/leagues"
    });

    Entities.LeagueCollection = Backbone.Collection.extend({
        url: "/api/leagues",
        model: Entities.League
    });
});