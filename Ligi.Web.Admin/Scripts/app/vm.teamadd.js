define('vm.teamadd',
    ['ko', 'datacontext','model', 'config', 'router', 'messenger'],
    function (ko, datacontext, model, config, router, messenger) {
        var isBusy = false,
            isRefreshing = false,
            currentTeamId = ko.observable(),
            team = ko.observable(),
            teamTemplate = 'team.edit',
            validationErrors = ko.observableArray([]),
            totalResults = ko.observable(),
            activate = function(routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                team(new model.Team());
            },
            canEditTeam = ko.computed(function () {
                return team();
            }),
            canLeave = function () {
                return true;
            },
            isDirty = ko.computed(function () {
                if (canEditTeam()) {
                    return team().dirtyFlag().isDirty();
                }
                return false;
            }),
            isValid = ko.computed(function () {
                return canEditTeam() ? validationErrors().length === 0 : true;
            }),
            goBackCmd = ko.asyncCommand({
                execute: function (complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function (isExecuting) {
                    return !isExecuting;
                }
            }),
            cancel = function () { team(new model.Team()); },
            saveCmd = ko.asyncCommand({
                execute: function (complete) {
                    if (canEditTeam()) {
                        $.when(datacontext.teams.addData(team(), {
                            success: function (t) {
                                team(t);
                            },
                        })).done(goToEditView)
                           .always(complete);
                        return;
                    }
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),
        goToEditView = function (result) {
            window.location.replace('#/teams/'+team().id());
        },
            pager = ko.pager(totalResults);
        //pager.CurrentPage.subscribe(function() {
        //    search();
        //});
        this.search = function () {
            var size = pager().pageSize();
            var start = (pager().CurrentPage() - 1) * size;
            teams.slice(start, start + size);

            var totalItemCount = fixtures().length;
            totalResults(totalItemCount);
        };
        return {
            activate: activate,
            canLeave: canLeave,
            team: team,
            goBackCmd: goBackCmd,
            isDirty: isDirty,
            isValid: isValid,
            teamTemplate: teamTemplate,
            saveCmd: saveCmd,
            cancel: cancel,
            pager: pager
        };
    });