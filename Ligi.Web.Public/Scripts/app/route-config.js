define('route-config',
    ['config', 'router', 'vm'],
    function (config, router, vm) {
        var
            logger = config.logger,
            
            register = function() {

                var routeData = [
                    {
                        view: config.viewIds.fixtures,
                        routes:
                            [{
                                isDefault: true,
                                route: config.hashes.fixtures,
                                title: 'Fixtures',
                                callback: vm.fixtures.activate,
                            }]
                    },
                    {
                        view: config.viewIds.bets,
                        routes:
                            [{
                                route: config.hashes.bets,
                                title: 'Bets',
                                callback: vm.bets.activate,
                            }]
                    },
                    {
                        view: config.viewIds.leaderboards,
                        routes:
                            [{
                                route: config.hashes.leaderboards,
                                title: 'Leaderboards',
                                callback: vm.leaderboards.activate,
                            }]
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