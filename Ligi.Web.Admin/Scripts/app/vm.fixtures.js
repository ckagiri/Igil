define('vm.fixtures',
    ['jquery', 'underscore', 'ko', 'datacontext', 'router', 'event.delegates', 'utils', 'messenger', 'config', 'store', 'filter.fixtures'],
    function ($, _, ko, datacontext, router, eventDelegates, utils, messenger, config, store, FixtureFilter) {
        var isRefreshing = false,
            leagues = ko.observableArray(),
            fixtures = ko.observableArray(),
            stateKey = { filter: 'vm.fixtures.filter' },
            fixtureFilter = new FixtureFilter(),
            months = ko.computed({
                read: function () {
                    if (!!fixtureFilter.season()) {
                        return [{ key: 1, name: "January" }, { key: 2, name: "February" }, { key: 3, name: "March" },
                            { key: 4, name: "April" }, { key: 5, name: " May" }, { key: 6, name: "June" },
                            { key: 7, name: "July" }, { key: 8, name: "August" }, { key: 9, name: "September" },
                            { key: 10, name: "October" }, { key: 11, name: "November" }, { key: 12, name: "December" }];
                    } else return [];
                },
                deferEvaluation: true
            }),
            seasons = ko.computed({
                read: function () {
                    var league = fixtureFilter && fixtureFilter.league();
                    if (!!league)
                        return league.seasons();
                    else
                        return [];
                },
                deferEvaluation: true
            }),
            addFilterSubscriptions = function () {
                fixtureFilter.league.subscribe(onFilterChange);
                fixtureFilter.season.subscribe(onFilterChange);
                fixtureFilter.month.subscribe(onFilterChange);
            },
            onFilterChange = function () {
                if (!isRefreshing) {
                    store.save(stateKey.filter, ko.toJS(fixtureFilter));
                    search(pager());
                }
            },
            editFixture = function (item) {
                selectedFixtureItem(item);
            },
            activate = function(routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                search(pager());
            },
            canLeave = function() {
                return true;
            },
            dataOptions = function (force) {
                var sort = function (f1, f2) {
                    return f1.kickOff() > f2.kickOff() ? 1 : -1;
                };
                return {
                    results: fixtures,
                    filter: fixtureFilter,
                    forceRefresh: force,
                    sortFunction: sort
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
            restoreFilter = function () {
                var stored = store.fetch(stateKey.filter);
                if (!stored) { return; }
                utils.restoreFilter({
                    stored: stored,
                    filter: fixtureFilter,
                    datacontext: datacontext
                });
            },
            getFixtures = function (callback) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    restoreFilter();
                    $.when(datacontext.fixtures.getData(dataOptions(false)))
                        .done(utils.invokeFunctionIfExists(callback));
                    isRefreshing = false;
                }
            },
            addFixture = function() {
                router.navigateTo('#/fixtureadd');
            },
            gotoDetails = function(selectedFixture) {
                if (selectedFixture && selectedFixture.id()) {
                    router.navigateTo(config.hashes.fixtures + '/' + selectedFixture.id());
                }
            },
            deleteFixture = function (selectedFixture) {
                if (selectedFixture && selectedFixture.id()) {
                    $.when(datacontext.fixtures.deleteData(selectedFixture))
                        .done(function () {
                            search(pager());
                        });
                }
            },
            totalResults = ko.observable(),
            pager = ko.pager(totalResults),
            search = function (that) {
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
            },
            init = function () {
                eventDelegates.fixturesEdit(gotoDetails);
                addFilterSubscriptions();
            };
        pager().CurrentPage.subscribe(function() {
            search(this);
        }, pager());
        init();
            return {
                activate: activate,
                canLeave: canLeave,
                fixtures: fixtures,
                leagues: leagues,
                seasons: seasons,
                months: months,
                fixtureFilter: fixtureFilter,
                editFixture: editFixture,
                addFixture: addFixture,
                deleteFixture: deleteFixture,
                forceRefreshCmd: forceRefreshCmd,
                pager: pager,
            };
    });