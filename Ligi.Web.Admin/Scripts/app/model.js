define('model',
    [
        'model.league',
        'model.season',
        'model.team',
        'model.seasonteam',
        'model.fixture'
    ],
    function (league, season, team, seasonteam, fixture) {
        var
            model = {
                League: league,
                Season: season,
                Team: team,
                SeasonTeam: seasonteam,
                Fixture: fixture
            };

        model.setDataContext = function (dc) {
            // Model's that have navigation properties 
            // need a reference to the datacontext.
            model.League.datacontext(dc);
            model.Season.datacontext(dc);
            model.Fixture.datacontext(dc);
        };

        return model;
    });