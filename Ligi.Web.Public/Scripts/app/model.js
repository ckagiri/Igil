define('model',
    [
        'model.league',
        'model.season',
        'model.team',
        'model.seasonteam',
        'model.fixture',
        'model.weekaccount',
        'model.bet',
        'model.weekleader',
        'model.monthleader',
        'model.seasonleader'
    ],
    function (league, season, team, seasonteam, fixture, weekaccount, bet, weekleader, monthleader, seasonleader) {
        var
            model = {
                League: league,
                Season: season,
                Team: team,
                SeasonTeam: seasonteam,
                Fixture: fixture,
                WeekAccount: weekaccount,
                Bet: bet,
                WeekLeader: weekleader,
                MonthLeader: monthleader,
                SeasonLeader: seasonleader
            };

        model.setDataContext = function (dc) {
            // Model's that have navigation properties 
            // need a reference to the datacontext.
            model.League.datacontext(dc);
            model.Season.datacontext(dc);
            model.Fixture.datacontext(dc);
            model.Bet.datacontext(dc);
        };

        return model;
    });