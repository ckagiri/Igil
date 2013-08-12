define('dataservice',
    [
        'dataservice.league',
        'dataservice.season',
        'dataservice.team',
        'dataservice.seasonteam',
        'dataservice.fixture',
        'dataservice.bets',
        'dataservice.lookup',
        'dataservice.leaderboard'
    ],
    function (league, season, team, seasonteam, fixture, bets, lookup, leaderboard) {
        return {
            league: league,
            season: season,
            team: team,
            seasonteam: seasonteam,
            fixture: fixture,
            bets: bets,
            lookup: lookup,
            leaderboard: leaderboard
        };
    });