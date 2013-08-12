define('dataservice.leaderboard', ['amplify'],
    function(amplify) {
        var init = function () {
            amplify.request.define('weekleaderboard', 'ajax', {
                url: '/api/leaderboard/weekleaderboard/?seasonId={seasonId}&startDate={startDate}&endDate={endDate}',
                dataType: 'json',
                type: 'GET'
                //cache:
            }),
            amplify.request.define('monthleaderboard', 'ajax', {
                url: '/api/leaderboard/monthleaderboard/?seasonId={seasonId}&month={month}',
                dataType: 'json',
                type: 'GET'
                //cache:
            }),
            amplify.request.define('seasonleaderboard', 'ajax', {
                url: '/api/leaderboard/seasonleaderboard/?seasonId={seasonId}',
                dataType: 'json',
                type: 'GET'
                //cache:
            });
        },
            getWeekLeaderBoard = function (callbacks, param) {
                return amplify.request({
                    resourceId: 'weekleaderboard',
                    data: param,
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            getMonthLeaderBoard = function (callbacks, param) {
                return amplify.request({
                    resourceId: 'monthleaderboard',
                    data: param,
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            getSeasonLeaderBoard = function(callbacks, param) {
                return amplify.request({
                    resourceId: 'seasonleaderboard',
                    data: param,
                    success: callbacks.success,
                    error: callbacks.error
                });
            };
        init();
        return {
            getWeekLeaderBoard: getWeekLeaderBoard,
            getMonthLeaderBoard: getMonthLeaderBoard,
            getSeasonLeaderBoard: getSeasonLeaderBoard
        };
    });