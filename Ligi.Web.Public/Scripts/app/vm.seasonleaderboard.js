define('vm.seasonleaderboard',
    ['jquery', 'underscore', 'ko', 'datacontext', 'utils'],
    function($, _, ko, datacontext, utils) {
        var seasonLeaders = ko.observableArray(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            leagues = ko.observableArray(),
            seasons = ko.computed({
                read: function() {
                    var league, leagueSeasons;
                    league = selectedLeague();

                    if (!!league)
                        leagueSeasons = league.seasons();
                    else
                        leagueSeasons = [];
                    return leagueSeasons;
                },
                deferEvaluation: true
            }),
            init = function() {
                getLeagues(getSeasonLeaderBoard);
            },
            canLeave = function () {
                return true;
            },
            getLeagues = function (callback) {
                $.when(datacontext.leagues.getData({
                    results: leagues
                })).done(utils.invokeFunctionIfExists(callback));
            },
            getSeasonLeaderBoard = function () {
                var season = selectedSeason();
                
                if (season) {
                        seasonId = season.id();
                        datacontext.seasonleaderboard.getData({
                            results: seasonLeaders,
                            param: { seasonId: seasonId },
                            forceRefresh: true
                        });
                    }
            };
        selectedLeague.subscribe(function() {
            selectedSeason(undefined);
        });
        selectedSeason.subscribe(function () {
            if (!!selectedSeason()) {
                getSeasonLeaderBoard();
            } else {
                seasonLeaders([]);
            }
        });
        return {
            init: init,
            leagues: leagues,
            seasons: seasons,
            selectedLeague: selectedLeague,
            selectedSeason: selectedSeason,
            canLeave: canLeave,
            seasonLeaders: seasonLeaders
        };
    });