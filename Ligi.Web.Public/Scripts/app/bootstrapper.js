define('bootstrapper',
    ['jquery', 'config', 'route-config', 'presenter', 'dataprimer', 'binder', 'pubsub'],
    function ($, config, routeConfig, presenter, dataprimer, binder, pubsub) {
        var
            run = function () {
                presenter.toggleActivity(true);
                config.dataserviceInit();
                //pubsub.initialize();
                $.when(dataprimer.fetch())
                    .done(binder.bind)
                    .done(routeConfig.register)
                    .always(function () {
                        presenter.toggleActivity(false);
                    });
            };
        return {
            run: run
        };
    });