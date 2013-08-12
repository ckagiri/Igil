define('vm.fixtures',
    ['jquery', 'underscore', 'ko', 'datacontext', 'router', 'utils', 'messenger', 'config', 'store', 'oddspage', 'bus'],
    function ($, _, ko, datacontext, router, utils, messenger, config, store, OddsPage, bus) {
        var message = ko.observable('No Fixtures'),
            leagues = ko.observableArray(),
            fixtures = ko.observableArray(),
            startDate = ko.observable(),
            endDate = ko.observable(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            selectedSeasonId = ko.observable(),
            weekaccount = ko.observable(),
            totalResults = ko.observable(),
            leagueSeason = ko.computed({
                read: function() {
                    if (selectedLeague() && selectedSeason()) {
                        return selectedLeague().name() + ' ' + selectedSeason().name();
                    } else {
                        return "";
                    }
                },
                deferEvaluation: true
            }),
            activate = function (routeData, callback) {
                var seasonId, selLeague, selSeason;
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                getLeagues();
                selLeague = _.find(leagues(), function(league) {
                    return league.code() === "EPL";
                });
                selSeason = _.find(selLeague.seasons(), function(season) {
                    return season.name() === "2013 - 2014";
                });
                seasonId = selSeason.id();
                $.when(getCurrentWeek(), getSeasonWeeks(seasonId).done(init));
                    
                selectedLeague(selLeague);
                selectedSeasonId(seasonId);
            },
            canLeave = function() {
                return true;
            },
            dataOptions = function(force) {
                return {
                    results: fixtures,
                    forceRefresh: force
                };
            },
            forceRefreshCmd = ko.asyncCommand({
                execute: function(complete) {
                    $.when(datacontext.fixtures.getFixtureStructure(dataOptions(true)))
                        .always(complete);
                }
            }),
            getLeagues = function() {
                if (!leagues().length) {
                    datacontext.leagues.getData({
                        results: leagues
                    });
                }
            },
            getFixtures = function() {
                var sort = function(f1, f2) {
                    return f1.kickOff() > f2.kickOff() ? 1 : -1;
                };
                if (!fixtures().length) {
                    datacontext.fixtures.getData({
                        results: fixtures,
                        sortFunction: sort
                    });
                }
            },
            betslip = new OddsPage.BetSlip(),
            getOdds = function() {
                $.each(fixtures(), function(i, fixture) {
                    var odds = [];
                    odds.push(new OddsPage.MatchOdds(fixture, "hangcheng", "home"));
                    odds.push(new OddsPage.MatchOdds(fixture, "hangcheng", "away"));
                    odds.push(new OddsPage.MatchOdds(fixture, "totalgoals", "over"));
                    odds.push(new OddsPage.MatchOdds(fixture, "totalgoals", "under"));
                    if (fixture.homeAsianHandicap() + fixture.awayAsianHandicap() === 0) {
                        fixture.hasHangCheng(true);
                    }
                    if (fixture.totalGoalsHandicap() !== 0) {
                        fixture.hasTotalGoals(true);
                    }
                    fixture.odds(odds);
                });
            },
            getCurrentWeek = function() {
                return $.Deferred(function(def) {
                    var sd = config.currentWeek.startDate(),
                        ed = config.currentWeek.endDate();
                    if (!(sd && ed)) {
                        $.when(
                            datacontext.currentWeek({ results: config.currentWeek }, {
                                success: function(currentWeek) {
                                    startDate(currentWeek.startDate());
                                    endDate(currentWeek.endDate());
                                }
                            }))
                            .done(function () {
                                 def.resolve();
                            })
                            .fail(function() { def.reject(); });
                    } else {
                        def.resolve();
                    }
                }).promise();
            },
            getSeasonWeeks = function(ssnId) {
                return $.Deferred(function(def) {
                    if (selectedSeason && selectedSeason()) {
                        def.resolve();
                    } else {
                        $.when(
                            datacontext.seasons.getSeasonWeeks(ssnId, {
                                success: function(season) {
                                    selectedSeason(season);
                                }
                            }))
                            .done(function() { def.resolve(); })
                            .fail(function() { def.reject(); });
                    }
                }).promise();
            },
            getWeekAccount = function (weekRange) {
                datacontext.weekaccounts.getWeekAccount(
                    weekRange.startDate,
                    weekRange.endDate, {
                        success: function (acc) {
                            weekaccount(acc);
                        },
                        error: function(response) {
                            console.log(response);
                        }
                    });
            },
            submitBetslipCmd = ko.asyncCommand({
                execute: function (complete) {
                    var seasonId, betItems;
                    betItems = betslip.items();
                    seasonId = selectedSeasonId();
                    $.when(datacontext.bets.submitBets({ seasonId: seasonId, betItems: betItems}))
                        .done(function(items) {
                            bus.data.publish({
                                topic: "betslip.success",
                                data: items
                            });
                        })
                        .fail(function(items) {
                            bus.data.publish({
                                topic: "betslip.error",
                                data: items
                            });
                            console.log(betItems);
                        })
                        .always(complete);
                    return;
                },
                canExecute: function(isExecuting) {
                    return !isExecuting;
                }
            }),
            init = function () {
                var index = 0, sd, ed, match, test;
                if (selectedSeason && selectedSeason()) {
                    sd = config.currentWeek.startDate();
                    ed = config.currentWeek.endDate();
                    if (sd && ed) {
                        match = _.find(selectedSeason().weeks(), function (week) {
                            test = moment(week.startDate).format('DD-MMM-YYYY') === moment(sd).format('DD-MMM-YYYY');
                            return test;
                        });
                        index = _.indexOf(selectedSeason().weeks(), match);
                        if (!match || !index) index = 0;
                    }
                }
                pagerViewModel.pageIndex(index);
            },
            pagerViewModel = {
                pageIndex: ko.observable(),
                previousPage: function() {
                    this.pageIndex(this.pageIndex() - 1);
                },
                nextPage: function() {
                    this.pageIndex(this.pageIndex() + 1);
                }
            };
        pagerViewModel.maxPageIndex = ko.computed(function() {
            var max = 0;
            if (selectedSeason() && selectedSeason().weeks())
                max = Math.ceil(selectedSeason().weeks().length) - 1;
            return max;
        }, pagerViewModel);
        pagerViewModel.page = ko.computed(function () {
            var index = this.pageIndex(),
                title = "", item = {}, list,
                kickOff, test, startOfWeek, endOfWeek;
            if (index !== 0 && !index) return null;
            if (selectedSeason && selectedSeason()) {
                item = selectedSeason().weeks()[index];
                title = moment(item.startDate).format('ddd, MMM Do') + ' - ' +
                    moment(item.endDate).format('ddd, MMM Do');
                fixtures([]);
                getFixtures();
                list = _.filter(fixtures(), function (fixture) {
                    kickOff = moment(fixture.kickOff()).toDate();
                    startOfWeek = moment(item.startDate).toDate();
                    endOfWeek = moment(item.endDate).toDate();
                    test = startOfWeek <= kickOff && kickOff <= endOfWeek;
                    return test;
                });
                fixtures(list);
                getOdds();
                getWeekAccount({ startDate: item.startDate, endDate: item.endDate });
                totalResults(fixtures().length);
            }
            return { item: item, title: title };
        }, pagerViewModel);
        $(function () {
            var ligiHub = $.connection.ligi;
            $.connection.hub.logging = true;
            $.connection.hub.start().done(function () {
                console.log("done");
            }).fail(function (err) {
                console.log(err);
            });
            ligiHub.client.received = function (msg) {
                message(msg.message);
            };
            ligiHub.client.updateWeekAccount = function (msg) {
                console.log(msg.message);
                datacontext.weekaccounts.updateWeekAccount(msg.message);
            };
            ligiHub.client.upsertFixture = function (msg) {
                datacontext.fixtures.upsertFixture(msg.message);
                fixtures.valueHasMutated();
            };
            ligiHub.client.removeFixture = function (msg) {
                var id = msg.message;
                datacontext.fixtures.removeById(id);
                fixtures.valueHasMutated();
            };
            ligiHub.client.upsertBet = function (msg) {
                datacontext.bets.upsertBet(msg.message);
            };
        });
        return {
                activate: activate,
                canLeave: canLeave,
                fixtures: fixtures,
                leagues: leagues,
                //seasons: seasons,
                betslip: betslip,
                leagueSeason: leagueSeason,
                forceRefreshCmd: forceRefreshCmd,
                startDate: startDate,
                endDate: endDate,
                weekaccount: weekaccount,
                pager: pagerViewModel,
                message: message,
                totalResults: totalResults,
                submitBetslipCmd: submitBetslipCmd,
            };
    });