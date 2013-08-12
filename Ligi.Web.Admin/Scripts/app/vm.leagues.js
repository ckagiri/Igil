define('vm.leagues',
    ['jquery', 'underscore', 'ko', 'datacontext', 'router', 'utils', 'messenger', 'config', 'store', 'vm.seasons', 'vm.seasonteams'],
    function ($, _, ko, datacontext, router, utils, messenger, config, store, SeasonsViewModel, SeasonTeamsViewModel) {
        var
            isBusy = false,
            isRefreshing = false,
            seasonTeamsTemplate = 'seasonteam.view',
            itemForEditing = ko.observable(),
            leagues = ko.observableArray(),
            leagueNameFocused = ko.observable(),
            acceptLeagueChanges = function (item) {
                var selected = selectedLeagueItem(),
                    edited = ko.toJS(itemForEditing());
                selected.name(edited.name);
                selected.code(edited.code);
                selectedLeagueItem(null);
                itemForEditing(null);
            },
            revertLeagueChanges = function (item) {
                selectedLeagueItem(null);
                itemForEditing(null);
            },
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            selectedLeagueItem = ko.observable(),
            selectedSeasonItem = ko.observable(),
            seasons = ko.computed(function () {
                var seasonsViewModel = new SeasonsViewModel.Init(selectedLeague);
                return {
                    seasons: seasonsViewModel.seasons(),
                    pager: seasonsViewModel.pager
                };
            }),
            seasonTeams = ko.computed(function() {
                var seasonTeamsViewModel = new SeasonTeamsViewModel.Init(selectedSeason);
                return {
                    seasonTeams: seasonTeamsViewModel.teams(),
                    pager: seasonTeamsViewModel.pager
                };
            }),
            leagueTemplate = function (item) {
                return selectedLeagueItem() === item ? 'league.edit' : 'league.view';
            },
            editLeague = function (item) {
                selectedLeagueItem(item);
                itemForEditing(ko.toJS(item));
                leagueNameFocused(true);
            },
            seasonTemplate = function (item) {
                return selectedSeasonItem() === item ? 'season.edit' : 'season.view';
            },
            editSeason = function (item) {
                selectedSeasonItem(item);
            },
            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                getLeagues();
                //getTeams();
                //getSeasons(callback);
                totalResults(leagues().length);
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
                    $.when(datacontext.leagues.getLeagueStructure(dataOptions(true)))
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
            getTeams = function() {
                if (!teams().length) {
                    datacontext.teams.getData({
                        results: teams
                    });
                }
            },
            getSeasons = function(callback) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    $.when(datacontext.seasons.getData(dataOptions(false)))
                        .always(utils.invokeFunctionIfExists(callback));
                    isRefreshing = false;
                }
            },
            totalResults = ko.observable(),
            pager = ko.pager(totalResults);
            pager().CurrentPage.subscribe(function() {
                search();
            }),
            this.search = function () {
                var size = pager().pageSize();
                var start = (pager().CurrentPage() - 1) * size;
                leagues.slice(start, start + size);
            
                var totalItemCount = leagues().length;
                totalResults(totalItemCount);
            };
            selectedLeague.subscribe(function () {
                selectedSeason(undefined);
            });
        return {
            activate: activate,
            canLeave: canLeave,
            leagues: leagues,
            seasonTeams: seasonTeams,
            seasons: seasons,
            acceptLeagueChanges: acceptLeagueChanges,
            cancelLeagueChanges: revertLeagueChanges,
            selectedLeague: selectedLeague,
            selectedSeason: selectedSeason,
            editLeague: editLeague,
            editSeason: editSeason,
            forceRefreshCmd: forceRefreshCmd,
            leagueTemplate: leagueTemplate,
            seasonTemplate: seasonTemplate,
            itemForEditing: itemForEditing,
            seasonTeamsTemplate: seasonTeamsTemplate,
            leagueNameFocused: leagueNameFocused,
            pager: pager,
        };
    });