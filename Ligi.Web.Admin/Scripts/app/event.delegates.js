define('event.delegates',
    ['jquery', 'ko', 'config'],
    function ($, ko, config) {
        var editTeamSelector = '.editTeam',
            editFixtureSelector = '.editFixture',
            editResultSelector = '.editResult',
            editMatchOddsSelector = '.editMatchOdds',
            bindEventToList = function(rootSelector, selector, callback, eventName) {
                var eName = eventName || 'click';
                $(rootSelector).on(eName, selector, function() {
                    //var context = ko.contextFor(this);
                    //var data = context.$data;
                    var data = ko.dataFor(this);
                    callback(data);
                    return false;
                });
            },
            teamsEdit = function (callback, eventName) {
                bindEventToList(config.viewIds.teams, editTeamSelector, callback, eventName);
            },
            fixturesEdit = function(callback, eventName) {
                bindEventToList(config.viewIds.fixtures, editFixtureSelector, callback, eventName);
            },
            oddsEdit = function (callback, eventName) {
                bindEventToList(config.viewIds.odds, editMatchOddsSelector, callback, eventName);
            },
            resultsEdit = function (callback, eventName) {
                bindEventToList(config.viewIds.results, editResultSelector, callback, eventName);
            };
        return {
            teamsEdit: teamsEdit,
            fixturesEdit: fixturesEdit,
            oddsEdit: oddsEdit,
            resultsEdit: resultsEdit,
        };
    });

