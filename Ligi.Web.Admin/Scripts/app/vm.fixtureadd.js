define('vm.fixtureadd',
    ['ko', 'datacontext', 'model', 'config', 'router', 'messenger'],
    function(ko, datacontext, model, config, router, messenger) {
        var leagues = ko.observableArray(),
            fixture = ko.observable(),
            selectedLeague = ko.observable(),
            selectedSeason = ko.observable(),
            kickOff = ko.observable(),
            kickOffBind = ko.computed({
                read: function () {
                    return new Date(kickOff());
                },
                write: function (value) {
                    kickOff(value);
                },
                deferEvaluation: true
            }),
            venue = ko.observable(""),
            seasons = ko.computed({
                read: function () {
                    return {
                        seasons: selectedLeague() && selectedLeague().seasons(),
                    };
                },
                deferEvaluation: true
            }),
            seasonTeams = ko.computed({
                read: function () {
                    return {
                        seasonTeams: selectedSeason() && selectedSeason().teams(),
                    };
                },
                deferEvaluation: true
            }),
            selectedHomeTeam = ko.observable(),
            selectedAwayTeam = ko.observable(),
            fixtureTemplate = 'fixture.add',
            validationErrors = ko.observableArray([]),
            activate = function (routeData, callback) {
                selectedHomeTeam(model.Team.Nullo);
                selectedAwayTeam(model.Team.Nullo);
                isDirty(false);
                kickOff(new Date());
                venue("");
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                getLeagues();
            },
            canEditFixture = ko.computed(function() {
                return true;
            }),
            canLeave = function() {
                return true;
            },
            isDirty = ko.observable(),
            isValid = ko.computed(function() {
                return canEditFixture() ? validationErrors().length === 0 : true;
            }),
            getLeagues = function () {
                if (!leagues().length) {
                    datacontext.leagues.getData({
                        results: leagues
                    });
                }
            },
            goBackCmd = ko.asyncCommand({
                execute: function(complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function(isExecuting) {
                    return !isExecuting;
                }
            }),
            goToEditView = function (result) {
                window.location.replace('#/fixtures/' + fixture().id());
            },
            saveCmd = ko.asyncCommand({
                execute: function (complete) {
                    if (canEditFixture()) {
                        var fixtureData = {
                            seasonId: selectedSeason().id(),
                            homeTeamId: selectedHomeTeam().id(),
                            awayTeamId: selectedAwayTeam().id(),
                            venue: venue(),
                            kickOff: kickOff()
                        };
                        $.when(datacontext.fixtures.addData(fixtureData, {
                            success: function(f) {
                                fixture(f);
                            }
                        })).done(goToEditView)
                            .always(complete);
                        return;
                    }
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty() && isValid;
                }
            });
        selectedHomeTeam.subscribe(function () {
            if (selectedHomeTeam()) {
                venue(selectedHomeTeam().homeGround());
            }
            if (selectedAwayTeam()) {
                isDirty(true);
            }
        });
        selectedAwayTeam.subscribe(function () {
            if(selectedHomeTeam()) {
                isDirty(true);
            }
        });
        return {
            activate: activate,
            canEditFixture: canEditFixture,
            canLeave: canLeave,
            goBackCmd: goBackCmd,
            isDirty: isDirty,
            isValid: isValid,
            saveCmd: saveCmd,
            leagues: leagues,
            selectedLeague: selectedLeague,
            selectedAwayTeam: selectedAwayTeam,
            selectedHomeTeam: selectedHomeTeam,
            seasons: seasons,
            kickOffBind: kickOffBind,
            seasonTeams: seasonTeams,
            selectedSeason: selectedSeason,
            fixtureTemplate: fixtureTemplate,
            venue: venue
        };
    });
        
    