define('vm.monthleaderboard',
    ['jquery', 'underscore', 'ko', 'datacontext', 'utils'],
    function($, _, ko, datacontext, utils) {
        var monthLeaders = ko.observableArray(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            selectedMonth = ko.observable(),
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
            months = ko.computed(function() {
                if (!!selectedSeason()) {
                    return [{ key: 1, name: "January" }, { key: 2, name: "February" }, { key: 3, name: "March" },
                        { key: 4, name: "April" }, { key: 5, name: " May" }, { key: 6, name: "June" },
                        { key: 7, name: "July" }, { key: 8, name: "August" }, { key: 9, name: "September" },
                        { key: 10, name: "October" }, { key: 11, name: "November" }, { key: 12, name: "December" }];
                }
                return [];
            }),
            init = function() {
                getLeagues(getMonthLeaderBoard);
            },
            canLeave = function() {
                return true;
            },
            getLeagues = function(callback) {
                $.when(datacontext.leagues.getData({
                    results: leagues
                }).done(utils.invokeFunctionIfExists(callback)));
            },
            getMonthLeaderBoard = function () {
                var season = selectedSeason(),
                    month = selectedMonth(),
                    seasonId;
                
                if (season && month) {
                        seasonId = season.id();
                        datacontext.monthleaderboard.getData({
                            results: monthLeaders,
                            param: { seasonId: seasonId, month: month },
                            forceRefresh: true
                        });
                    }
            };
        selectedLeague.subscribe(function() {
            selectedSeason(undefined);
        });
        selectedSeason.subscribe(function() {
            selectedMonth(undefined);
        });
        selectedMonth.subscribe(function () {
            if (!!selectedMonth()) {
                getMonthLeaderBoard();
            } else {
                monthLeaders([]);
            }
        });
        return {
            init: init,
            leagues: leagues,
            seasons: seasons,
            selectedLeague: selectedLeague,
            selectedSeason: selectedSeason,
            months: months,
            selectedMonth: selectedMonth,
            canLeave: canLeave,
            monthLeaders: monthLeaders
        };
    });