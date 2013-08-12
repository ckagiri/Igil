define('route-config',
    ['config', 'router', 'vm'],
    function (config, router, vm) {
        var
            logger = config.logger,
            register = function() {
                var routeData = [
                    // Leagues
                    {
                        view: config.viewIds.leagues,
                        routes:
                            [{
                                route: config.hashes.leagues,
                                title: 'Leagues',
                                callback: vm.leagues.activate,
                            }]
                    },
                    // Teams
                    {
                        view: config.viewIds.teams,
                        routes:
                            [{
                                route: config.hashes.teams,
                                title: 'Teams',
                                callback: vm.teams.activate,
                            }]
                    },
                    {
                        view: config.viewIds.team,
                        route: config.hashes.teams + '/:id',
                        title: 'Team',
                        callback: vm.team.activate,
                    },
                    {
                        view: config.viewIds.teamadd,
                        route: '#/teamadd',
                        title: 'Add Team',
                        callback: vm.teamadd.activate,
                    },
                    // Fixtures
                    {
                        view: config.viewIds.fixtures,
                        routes:
                            [{
                                isDefault: true,
                                route: config.hashes.fixtures,
                                title: 'Fixtures',
                                callback: vm.fixtures.activate,
                            }],
                    },
                    {
                        view: config.viewIds.fixture,
                        route: config.hashes.fixtures + '/:id',
                        title: 'Fixture',
                        callback: vm.fixture.activate,
                    },
                    {
                        view: config.viewIds.fixtureadd,
                        route: '#/fixtureadd',
                        title: 'Add Fixture',
                        callback: vm.fixtureadd.activate,
                    },
                    // Odds
                    {
                        view: config.viewIds.odds,
                        routes:
                            [{
                                route: config.hashes.odds,
                                title: 'Odds',
                                callback: vm.odds.activate,
                            }]
                        
                    },
                    {
                        view: config.viewIds.matchodds,
                        route: config.hashes.odds + '/:id',
                        title: 'MatchOdds',
                        callback: vm.matchodds.activate,
                    },
                    // Results
                    {
                        view: config.viewIds.results,
                        routes:
                            [{
                                route: config.hashes.results,
                                title: 'Results',
                                callback: vm.results.activate,
                            }]
                    },
                    {
                        view: config.viewIds.result,
                        route: config.hashes.results + '/:id',
                        title: 'Result',
                        callback: vm.result.activate,
                    },
                    // Invalid routes
                    {
                        view: '',
                        route: /.*/,
                        title: '',
                        callback: function() {
                            logger.error(config.toasts.invalidRoute);
                        }
                    }
                ];

                for (var i = 0; i < routeData.length; i++) {
                    router.register(routeData[i]);
                }

                // Crank up the router
                router.run();
            };
            

        return {
            register: register
        };
    });