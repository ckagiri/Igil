LigiAdmin.module('Entities', function (Entities, LigiAdmin, Backbone, Marionette, $, _) {
    Entities.Fixture = Backbone.Model.extend({
        urlRoot: "/api/teams",

        defaults: {
            homeTeamId: '',
            awayTeamId: '',
            homeGround: ''
        }
    });

    Entities.configureStorage(Entities.Fixture);

    Entities.FixtureCollection = Backbone.Collection.extend({
        url: "/api/fixtures",
        model: Entities.Fixture,
        comparator: "name"
    });

    Entities.configureStorage(Entities.FixtureCollection);

    var initializeFixtures = function () {
        var Fixtures = new Entities.FixtureCollection([
            { id: 1, homeTeamId: 1, awayTeamId: 2, homeGround: 'Stamford Bridge' },
            { id: 2, homeTeamId: 2, awayTeamId: 3, homeGround: 'Stamford Bridge' },
            { id: 1, homeTeamId: 3, awayTeamId: 1, homeGround: 'Stamford Bridge' },
        ]);
        Fixtures.forEach(function (fixture) {
            fixture.save();
        });
        return teams.models;
    };

    var API = {
        getFixtureEntities: function () {
            var fixtures = new Entities.FixtureCollection();
            var defer = $.Deferred();
            fixtures.fetch({
                success: function (data) {
                    defer.resolve(data);
                },
                error: function (response) {
                    defer.resolve(undefined);
                }
            });
            var promise = defer.promise();
            $.when(promise).done(function () {
                if (fixtures.length === 0) {
                    var models = initializeFixtures();
                    fixtures.reset(models);
                }
            });
            return fixtures;
        },
        getFixtureEntity: function (id) {
            var fixture = new Entities.Fixture({ id: id });
            fixture.fetch();
            return fixture;
        }
    };
    LigiAdmin.reqres.setHandler("fixture:entities", function () {
        return API.getFixtureEntities();
    });
    LigiAdmin.reqres.setHandler("fixture:entity", function (id) {
        return API.getFixtureEntity(id);
    });
});