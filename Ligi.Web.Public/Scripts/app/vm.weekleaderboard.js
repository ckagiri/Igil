define('vm.weekleaderboard',
    ['jquery', 'underscore', 'ko', 'datacontext', 'utils'],
    function($, _, ko, datacontext, utils) {
        var weekLeaders = ko.observableArray(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            selectedMonth = ko.observable(),
            selectedWeek = ko.observable(),
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
            weeks = ko.observableArray(),
            init = function() {
                getLeagues(getWeekLeaderBoard);
            },
            canLeave = function () {
                return true;
            },
            getLeagues = function (callback) {
                $.when(datacontext.leagues.getData({
                    results: leagues
                }).done(utils.invokeFunctionIfExists(callback)));
            },
            getMonthWeeks = function () {
                var month = selectedMonth(), weeksArr;
                weeks([]);
                weeksArr = weeks();
                if (month) {
                    datacontext.monthWeeks({
                        param: {
                            year: 2013,
                            month: month,
                        },
                    }, {
                        success: function (wks) {
                            _.each(wks, function (wk) {
                                var startDate = wk.startDate,
                                    endDate = wk.endDate,
                                    week;

                                name = moment(startDate).format('ddd MMM DD') +
                                    " - " + moment(endDate).format('ddd MMM DD');
                                week = { startDate: startDate, endDate: endDate, name: name };
                                weeksArr.push(week);
                            });
                            weeks.valueHasMutated();
                        },
                        error: function(err) {
                            // wtf?
                        }
                    });
                }
            },
        getWeekLeaderBoard = function () {
                var season = selectedSeason(),
                    week = selectedWeek(),
                    seasonId, startDate, endDate;
                if (season && week) {
                    seasonId = season.id();
                    startDate = week.startDate;
                    endDate = week.endDate;
                    datacontext.weekleaderboard.getData({
                        results: weekLeaders,
                        param: {
                            seasonId: seasonId,
                            startDate: startDate,
                            endDate: endDate,
                        },
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
            selectedWeek(undefined);
            getMonthWeeks();
        });
        selectedWeek.subscribe(function () {
            if (!!selectedWeek()) {
                getWeekLeaderBoard();
            } else {
                weekLeaders([]);
            }
        });
        return {
            init: init,
            leagues: leagues,
            seasons: seasons,
            selectedLeague: selectedLeague,
            selectedSeason: selectedSeason,
            months: months,
            weeks: weeks,
            selectedMonth: selectedMonth,
            selectedWeek: selectedWeek,
            canLeave: canLeave,
            weekLeaders: weekLeaders
        };
    });