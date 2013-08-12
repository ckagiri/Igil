define('dataservice',
    [
        'dataservice.league',
        'dataservice.season',
        'dataservice.team',
        'dataservice.seasonteam',
        'dataservice.fixture'
    ],
    function (league, season, team, seasonteam, fixture) {
        return {
            league: league,
            season: season,
            team: team,
            seasonteam: seasonteam,
            fixture: fixture
        };
    });