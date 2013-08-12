define('vm',
[   
    'vm.shell',
    'vm.fixtures',
    'vm.bets',
    'vm.leaderboards'
],
    function (shell, fixtures, bets, leaderboards) {
        return {
            shell: shell,
            fixtures: fixtures,
            bets: bets,
            leaderboards: leaderboards
    };
});