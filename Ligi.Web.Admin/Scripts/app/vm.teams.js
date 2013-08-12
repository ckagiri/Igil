define('vm.teams',
    ['jquery', 'underscore', 'ko', 'datacontext', 'router', 'filter.teams', 'event.delegates', 'utils', 'messenger', 'config', 'store'],
    function($, _, ko, datacontext, router, TeamFilter, eventDelegates, utils, messenger, config, store) {
        var isRefreshing = false,
            teams = ko.observableArray(),
            teamTemplate = 'team.view',
            teamFilter = new TeamFilter(),
            totalResults = ko.observable(),
            activate = function(routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                search(pager());
            },
            canLeave = function() {
                teams([]);
                return true;
            },
            forceRefreshCmd = ko.asyncCommand({
                execute: function(complete) {
                    $.when(datacontext.teams.getData({ results: teams }))
                        .always(complete);
                }
            }),
            getTeams = function() {
                    datacontext.teams.getData({
                        results: teams,
                        filter: teamFilter,
                        forceRefresh: false
                    });
            },
            clearFilter = function () {
                teamFilter.searchText('');
            },
            addTeam = function() {
                router.navigateTo('#/teamadd');
            },
            gotoDetails = function(selectedTeam) {
                if (selectedTeam && selectedTeam.id()) {
                    router.navigateTo(config.hashes.teams + '/' + selectedTeam.id());
                }
            },
            deleteTeam = function(selectedTeam) {
                if (selectedTeam && selectedTeam.id()) {
                    $.when(datacontext.teams.deleteData(selectedTeam))
                        .done(function() {
                            search(pager());
                        });
                }
            },
            pager = ko.pager(totalResults),
            search = function (that) {
                var size = that.PageSize();
                var start = (that.CurrentPage() - 1) * size;
                teams([]);
                getTeams();
                totalResults(teams().length);
                var totalItemCount = totalResults();
                var teamsArr = teams().slice(start, start + size);
                teams(teamsArr);
                totalResults(totalItemCount);
            },
            init = function() {
                eventDelegates.teamsEdit(gotoDetails);
                teamFilter.searchText.subscribe(function () {
                    search(pager());
                });
            };
        pager().CurrentPage.subscribe(function () {
            search(this);
        }, pager());
        init();
        return {
            activate: activate,
            canLeave: canLeave,
            teams: teams,
            addTeam: addTeam,
            deleteTeam: deleteTeam,
            teamFilter: teamFilter,
            clearFilter: clearFilter,
            forceRefreshCmd: forceRefreshCmd,
            teamTemplate: teamTemplate,
            pager: pager,
        };
    });