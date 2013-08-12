define('vm.odds',
    ['jquery', 'underscore', 'ko', 'datacontext', 'router', 'event.delegates', 'utils', 'messenger', 'config', 'store', 'vm.seasons'],
    function ($, _, ko, datacontext, router, eventDelegates, utils, messenger, config, store, SeasonsViewModel) {
        var isBusy = false,
            isRefreshing = false,
            leagues = ko.observableArray(),
            fixtures = ko.observableArray(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            selectedFixtureItem = ko.observable(),
            seasons = ko.computed({
                read: function () {
                    return {
                        seasons: selectedLeague() && selectedLeague().seasons(),
                    };
                },
                deferEvaluation: true
            }),
            oddsTemplate = function(item) {
                return selectedFixtureItem() === item ? 'odds.edit' : 'odds.view';
            },
            editFixture = function(item) {
                selectedFixtureItem(item);
            },
            activate = function(routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                search(pager());
            },
            canLeave = function() {
                return true;
            },
            dataOptions = function(force) {
                return {
                    results: seasons,
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
            getFixtures = function () {
                var sort = function (f1, f2) {
                    return f1.kickOff() > f2.kickOff() ? 1 : -1;
                };
                if (!fixtures().length) {
                    datacontext.fixtures.getData({
                        results: fixtures,
                        sortFunction: sort
                    });
                }
            },
            gotoDetails = function(selectedFixture) {
                if (selectedFixture && selectedFixture.id()) {
                    router.navigateTo(config.hashes.odds + '/' + selectedFixture.id());
                }
            },
            init = function() {
                eventDelegates.oddsEdit(gotoDetails);
            },
            totalResults = ko.observable(),
            pager = ko.pager(totalResults),
            search = function(that) {
                that.PageSize(15);
                var size = that.PageSize();
                var start = (that.CurrentPage() - 1) * size;
                fixtures([]);
                getLeagues();
                getFixtures();
                totalResults(fixtures().length);
                var totalItemCount = totalResults();
                var fixturesArr = fixtures().slice(start, start + size);
                fixtures(fixturesArr);
                totalResults(totalItemCount);
            };
        pager().CurrentPage.subscribe(function () {
            search(this);
        }, pager());
        init();
        return {
            activate: activate,
            canLeave: canLeave,
            fixtures: fixtures,
            leagues: leagues,
            seasons: seasons,
            selectedLeague: selectedLeague,
            selectedSeason: selectedSeason,
            editFixture: editFixture,
            forceRefreshCmd: forceRefreshCmd,
            oddsTemplate: oddsTemplate,
            pager: pager,
        };
    });