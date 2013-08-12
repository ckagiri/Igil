define('vm.fixture',
    ['ko', 'datacontext', 'config', 'router', 'messenger'],
    function(ko, datacontext, config, router, messenger) {
        var currentFixtureId = ko.observable(),
            logger = config.logger,
            fixture = ko.observable(),
            fixtureTemplate = 'fixture.edit',
            validationErrors = ko.observableArray([]),
            seasonTeams = ko.observableArray([]),
            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                currentFixtureId(routeData.id);
                getFixture(callback);
            },
            canEditFixture = ko.computed(function() {
                return fixture();
            }),
            canLeave = function() {
                return true;
            },
            isDirty = ko.computed(function () {
                if (canEditFixture()) {
                    return fixture().dirtyFlag().isDirty();
                }
                return false;
            }),
            isValid = ko.computed(function() {
                return canEditFixture() ? validationErrors().length === 0 : true;
            }),
            getFixture = function(completeCallback, forceRefresh) {
                var callback = function () {
                    fixture().dirtyFlag().reset();
                    if (completeCallback) {
                        completeCallback();
                    }
                    //debugger;
                    var seasonId = fixture().seasonId();
                    var sTeams = datacontext.seasons.getTeamsBySeasonId(seasonId);
                    seasonTeams(sTeams);
                };
                datacontext.fixtures.getFixtureById(
                    currentFixtureId(), {
                        success: function(f) {
                            fixture(f);
                            callback();
                        },
                        error: callback
                    },
                    forceRefresh
                );
            },
            cancelCmd = ko.asyncCommand({
                execute: function(complete) {
                    var callback = function() {
                        complete();
                        logger.success(config.toasts.retreivedData);
                    };
                    canEditFixture() && getFixture(callback, true);
                },
                canExecute: function(isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),
            goBackCmd = ko.asyncCommand({
                execute: function(complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function(isExecuting) {
                    return !isExecuting && !isDirty();
                }
            }),
            saveCmd = ko.asyncCommand({
                execute: function(complete) {
                    if (canEditFixture()) {
                        $.when(datacontext.fixtures.updateData(fixture()))
                            .always(complete);
                        return;
                    }
                },
                canExecute: function(isExecuting) {
                    return !isExecuting && isDirty() && isValid;
                }
            });
        return {
            activate: activate,
            cancelCmd: cancelCmd,
            canEditFixture: canEditFixture,
            canLeave: canLeave,
            goBackCmd: goBackCmd,
            isDirty: isDirty,
            isValid: isValid,
            saveCmd: saveCmd,
            fixture: fixture,
            teams: seasonTeams,
            fixtureTemplate: fixtureTemplate,
        };
    });
        
    