define('dataprimer',
    ['ko', 'datacontext', 'config'],
    function (ko, datacontext, config) {

        var logger = config.logger,
            
            fetch = function () {
                
                return $.Deferred(function (def) {

                    var data = {
                        leagues: ko.observable(),
                        seasons: ko.observable(),
                        teams: ko.observable(),
                        seasonteam: ko.observable(),
                        fixtures: ko.observable()
                    };

                    $.when(
                        datacontext.leagues.getData({ results: data.leagues }),
                        datacontext.seasons.getData({ results: data.seasons }),
                        datacontext.teams.getData({ results: data.teams }),
                        datacontext.seasonTeams.getData({ results: data.seasonteam }),
                        datacontext.fixtures.getData({ results: data.fixtures })
                    )
                    .pipe(function () {
                        datacontext.relationships.refreshLocal();
                    })

                    .pipe(function () {
                        logger.success('Fetched data for: '
                            + '<div>' + data.leagues().length + ' leagues </div>'
                            + '<div>' + data.seasons().length + ' seasons </div>'
                            + '<div>' + data.teams().length + ' teams </div>'
                            + '<div>' + data.seasonteam().length + ' season-team </div>'
                            + '<div>' + data.fixtures().length + ' fixtures </div>'
                        );
                    })

                    .fail(function () { def.reject(); })

                    .done(function () { def.resolve(); });

                }).promise();
            };

        return {
            fetch: fetch
        };
    });