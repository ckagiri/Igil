define('vm',
    [
        'vm.leagues',
        'vm.teams',
        'vm.team',
        'vm.teamadd',
        'vm.fixtures',
        'vm.fixture',
        'vm.fixtureadd',
        'vm.odds',
        'vm.matchodds',
        'vm.results',
        'vm.result',
        'vm.shell'
    ],
    function(leagues, teams, team,teamadd, fixtures,fixture,fixtureadd, odds, matchodds, results, result, shell) {
        return {
            leagues: leagues,
            teams: teams,
            team: team,
            teamadd: teamadd,
            fixtures: fixtures,
            fixture: fixture,
            fixtureadd: fixtureadd,
            odds: odds,
            matchodds: matchodds,
            results: results,
            result: result,
            shell: shell
        };
    });