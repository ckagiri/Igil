define('vm.bets',
    ['jquery', 'underscore', 'ko', 'datacontext', 'router', 'utils', 'messenger', 'config', 'store', 'bus'],
    function ($, _, ko, datacontext, router, utils, messenger, config, store, bus) {
        var message = ko.observable('No Bets'),
            leagues = ko.observableArray(),
            bets = ko.observableArray(),
            startDate = ko.observable(),
            endDate = ko.observable(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            selectedSeasonId = ko.observable(),
            weekaccount = ko.observable(),
            totalResults = ko.observable(),
            leagueSeason = ko.computed({
                read: function () {
                    if (selectedLeague() && selectedSeason()) {
                        return selectedLeague().name() + ' ' + selectedSeason().name();
                    } else {
                        return "";
                    }
                },
                deferEvaluation: true
            }),
            activate = function (routeData, callback) {
               // debugger;
                var seasonId, selLeague, selSeason;
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                getLeagues();
                selLeague = _.find(leagues(), function (league) {
                    return league.code() === "EPL";
                });
                selSeason = _.find(selLeague.seasons(), function (season) {
                    return season.name() === "2013 - 2014";
                });
                seasonId = selSeason.id();
                $.when(getCurrentWeek(), getSeasonWeeks(seasonId)).done(init);
                selectedLeague(selLeague);
                selectedSeasonId(seasonId);
            },
            canLeave = function () {
                return true;
            },
            dataOptions = function (force) {
                return {
                    results: bets,
                    forceRefresh: force
                };
            },
            forceRefreshCmd = ko.asyncCommand({
                execute: function (complete) {
                    $.when(datacontext.bets.getBetstructure(dataOptions(true)))
                        .always(complete);
                }
            }),
            getLeagues = function () {
                if (!leagues().length) {
                    datacontext.leagues.getData({
                        results: leagues
                    });
                }
            },
            getBets = function () {
                var sort = function (b1, b2) {
                    return b1.timeStamp() > b2.timeStamp() ? 1 : -1;
                };
                if (!bets().length) {
                    datacontext.bets.getData({
                        results: bets,
                        sortFunction: sort
                    });
                }
            },
            getCurrentWeek = function () {
                return $.Deferred(function (def) {
                    var sd = config.currentWeek.startDate(),
                        ed = config.currentWeek.endDate();
                    if (!(sd && ed)) {
                        $.when(
                            datacontext.currentWeek({ results: config.currentWeek }, {
                                success: function (currentWeek) {
                                    startDate(currentWeek.startDate());
                                    endDate(currentWeek.endDate());
                                }
                            }))
                            .done(function () {
                                def.resolve();
                            })
                            .fail(function () { def.reject(); });
                    } else {
                        def.resolve();
                    }
                }).promise();
            },
            getSeasonWeeks = function (ssnId) {
                return $.Deferred(function (def) {
                    if (selectedSeason && selectedSeason()) {
                        def.resolve();
                    } else {
                        $.when(
                            datacontext.seasons.getSeasonWeeks(ssnId, {
                                success: function (season) {
                                    selectedSeason(season);
                                }
                            }))
                            .done(function () { def.resolve(); })
                            .fail(function () { def.reject(); });
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
                        error: function (response) {
                            console.log(response);
                        }
                    });
            },
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
                previousPage: function () {
                    this.pageIndex(this.pageIndex() - 1);
                },
                nextPage: function () {
                    this.pageIndex(this.pageIndex() + 1);
                }
            };
        pagerViewModel.maxPageIndex = ko.computed(function () {
            var max = 0;
            if (selectedSeason() && selectedSeason().weeks())
                max = Math.ceil(selectedSeason().weeks().length) - 1;
            return max;
        }, pagerViewModel);
        pagerViewModel.page = ko.computed(function () {
            var index = this.pageIndex(),
                title = "", item = {}, list,
                timeStamp, test, startOfWeek, endOfWeek;
            if (index !== 0 && !index) return null;
            if (selectedSeason && selectedSeason()) {
                item = selectedSeason().weeks()[index];
                title = moment(item.startDate).format('ddd, MMM Do') + ' - ' +
                    moment(item.endDate).format('ddd, MMM Do');
                bets([]);
                getBets();
                list = _.filter(bets(), function (bet) {
                    timeStamp = moment(bet.fixture().kickOff()).toDate();
                    startOfWeek = moment(item.startDate).toDate();
                    endOfWeek = moment(item.endDate).toDate();
                    test = startOfWeek <= timeStamp && timeStamp <= endOfWeek;
                    return test;
                });
                bets(list);
                getWeekAccount({ startDate: item.startDate, endDate: item.endDate });
                totalResults(bets().length);
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
        });
        return {
            activate: activate,
            canLeave: canLeave,
            bets: bets,
            leagues: leagues,
            leagueSeason: leagueSeason,
            forceRefreshCmd: forceRefreshCmd,
            startDate: startDate,
            endDate: endDate,
            weekaccount: weekaccount,
            pager: pagerViewModel,
            message: message,
            totalResults: totalResults,
        };
    });