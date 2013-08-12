define('vm.leaderboards', 
    ['vm.weekleaderboard', 'vm.monthleaderboard','vm.seasonleaderboard', 'messenger'],
    function (weekleaderboard, monthleaderboard, seasonleaderboard, messenger) {
        var canLeave = function () {
                return true;
            },
            activate = function () {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                weekleaderboard.init();
                monthleaderboard.init();
                seasonleaderboard.init();
            };
        return {
            activate: activate,
            wlb: weekleaderboard,
            mlb: monthleaderboard,
            slb: seasonleaderboard
        };
    });