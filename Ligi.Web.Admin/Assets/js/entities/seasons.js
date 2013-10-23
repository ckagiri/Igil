LigiAdmin.module('Entities', function (Entities, LigiAdmin, Backbone, Marionette, $, _) {
    Entities.Season = Backbone.Model.extend({
        urlRoot: "/api/seasons",
    });

    Entities.SeasonCollection = Backbone.Collection.extend({
        url: "/api/seasons",
        model: Entities.Season
    });
});