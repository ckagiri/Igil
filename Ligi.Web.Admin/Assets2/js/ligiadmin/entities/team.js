LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    Entities.Team = App.Entities.Model.extend({
        urlRoot: "/api/teams",

        defaults: {
            name: '',
            code: '',
            homeGround: ''
        }
    });

    //Entities.configureStorage(Entities.Team);

    Entities.TeamCollection = App.Entities.Collection.extend({
        url: "/api/teams",
        model: Entities.Team,
        comparator: "name"
    });

    //Entities.configureStorage(Entities.TeamCollection);

    var initializeTeams = function () {
        var teams = new Entities.TeamCollection([
            { id: 1, name: 'Chelsea', code: 'CHE', homeGround: 'Stamford Bridge' },
            { id: 2, name: 'Manchester United', code: 'MANU', homeGround: 'Old Trafford' },
            { id: 3, name: 'Manchester City', code: 'MANC', homeGround: 'Etihad Stadium' }
        ]);
        teams.forEach(function (team) {
            team.save();
        });
        return teams.models;
    };

    var API = {
        getTeams: function () {
            var teams = new Entities.TeamCollection();
            teams.fetch({ reset: true });
            return teams;
        }
    };
    App.reqres.setHandler("team:entities", function () {
        return API.getTeams();
    });
});