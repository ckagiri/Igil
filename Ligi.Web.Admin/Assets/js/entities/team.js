﻿LigiAdmin.module('Entities', function(Entities, LigiAdmin, Backbone, Marionette, $, _) {
    Entities.Team = Backbone.Model.extend({
        urlRoot: "/api/teams",
        
        defaults: {
            name: '',
            code: '',
            homeGround: ''
        },
        
        validate: function (attrs, option) {
            var errors = {};
            if(!attrs.name) {
                errors.name = "can't be blank";
            }
            if(!attrs.code) {
                errors.code = "can't be blank";
            } else {
                if (attrs.code.length < 3) {
                    errors.code = "should be at least 3 letters long";
                }
            }
            if (!_.isEmpty(errors)) {
                return errors;
            }
            return undefined;
        }
    });
    
    Entities.configureStorage(Entities.Team);
    
    Entities.TeamCollection = Backbone.Collection.extend({
        url: "/api/teams",
        model: Entities.Team,
        comparator: "name"
    });
    
    Entities.configureStorage(Entities.TeamCollection);

    var initializeTeams = function() {
        var teams = new Entities.TeamCollection([
            { id: 1, name: 'Chelsea', code: 'CHE', homeGround: 'Stamford Bridge' },
            { id: 2, name: 'Manchester United', code: 'MANU', homeGround: 'Old Trafford' },
            { id: 3, name: 'Manchester City', code: 'MANC', homeGround: 'Etihad Stadium' }
        ]);
        teams.forEach(function(team) {
            team.save();
        });
        return teams.models;
    };

    var API = {
        getTeamEntities: function () {
            var teams = new Entities.TeamCollection();
            var defer = $.Deferred();
            teams.fetch({
                success: function (data) {
                    defer.resolve(data);
                },
                error: function (response) {
                    defer.resolve(undefined);
                }
            });
            var promise = defer.promise();
            $.when(promise).done(function() {
                if (teams.length === 0) {
                    var models = initializeTeams();
                    teams.reset(models);
                }
            });
            return teams;
        },
        getTeamEntity: function (id) {
            var team = new Entities.Team({ id: id });
            team.fetch();
            return team;
        }
    };
    LigiAdmin.reqres.setHandler("team:entities", function() {
        return API.getTeamEntities();
    });
    LigiAdmin.reqres.setHandler("team:entity", function(id) {
        return API.getTeamEntity(id);
    });
});