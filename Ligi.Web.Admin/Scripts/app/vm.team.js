define('vm.team',
    ['ko', 'datacontext', 'config', 'router', 'messenger'],
    function (ko, datacontext, config, router, messenger) {
        var logger = config.logger,
            currentTeamId = ko.observable(),
            team = ko.observable(),
            teamTemplate = 'team.edit',
            validationErrors = ko.observableArray([]),
            totalResults = ko.observable(),
            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                currentTeamId(routeData.id);
                getTeam(callback);
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
            getTeam = function(completeCallback, forceRefresh) {
                var callback = function() {
                    if (completeCallback) {
                        completeCallback();
                    }
                };
                datacontext.teams.getTeamById(
                    currentTeamId(), {
                        success: function (t) {
                            team(t);
                            callback();
                        },
                        error: callback
                    },
                    forceRefresh
                );
            },
            goBackCmd = ko.asyncCommand({
                execute: function (complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && !isDirty();
                }
            }),
            cancelCmd = ko.asyncCommand({
                execute: function (complete) {
                    var callback = function () {
                        complete();
                        logger.success(config.toasts.retreivedData);
                    };
                    getTeam(callback, true);
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),
            saveCmd = ko.asyncCommand({
                execute: function (complete) {
                    if (canEditTeam()) {
                        $.when(datacontext.teams.updateData(team()))
                            .always(complete);
                        return;
                    }
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),

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
            cancelCmd: cancelCmd,
            pager: pager
        };
    });