define('dataservice.bets', ['amplify'],
    function(amplify) {
        var init = function() {
            amplify.request.define('bets', 'ajax', {
                url: '/api/bets/',
                dataType: 'json',
                type: 'GET'
                //cache:
            }),
            amplify.request.define('seasonbets', 'ajax', {
                url: '/api/bets/{seasonId}',
                dataType: 'json',
                type: 'GET'
                //cache:
            }),
            amplify.request.define('seasonweekbets', 'ajax', {
                url: '/api/bets/?seasonId={seasonId}&startDate={startDate}&endDate={endDate}',
                dataType: 'json',
                type: 'GET'
                //cache:
            }),
            amplify.request.define('betssubmit', 'ajax', {
                url: '/api/bets',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            });
        },
            getBets = function (callbacks) {
                return amplify.request({
                    resourceId: 'bets',
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            getSeasonBets = function(callbacks, seasonId) {
                return amplify.request({
                    resourceId: 'seasonbets',
                    data: { seasonId: seasonId },
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            getSeasonWeekBets = function(callbacks, seasonId, startDate, endDate) {
                var data = {
                    seasonId: seasonId,
                    startDate: startDate,
                    endDate: endDate
                };
                return amplify.request({
                    resourceId: 'seasonweekbets',
                    data: data,
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            submitBets = function (callbacks, betslipJson) {
                return amplify.request({
                    resourceId: 'betssubmit',
                    data: betslipJson,
                    success: callbacks.success,
                    error: callbacks.error
                });
            };
        init();
        return {
            getBets: getBets,
            getSeasonBets: getSeasonBets,
            getSeasonWeekBets: getSeasonWeekBets,
            submitBets: submitBets
        };
    });