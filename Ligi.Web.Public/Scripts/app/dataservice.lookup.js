define('dataservice.lookup',
    ['amplify'],
    function (amplify) {
        var
            init = function () {

                amplify.request.define('currentweek', 'ajax', {
                    url: '/api/lookups/currentweek',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                }),

                amplify.request.define('seasonweeks', 'ajax', {
                    url: '/api/lookups/seasonweeks/?seasonId={seasonId}',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                }),
                
                amplify.request.define('monthweeks', 'ajax', {
                    url: '/api/lookups/monthweeks/?year={year}&month={month}',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                }),

                amplify.request.define('weekaccount', 'ajax', {
                    url: '/api/lookups/weekaccount/?startDate={startDate}&endDate={endDate}',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                });
            },

            getCurrentWeek = function (callbacks) {
                return amplify.request({
                    resourceId: 'currentweek',
                    success: callbacks.success,
                    error: callbacks.error
                });
            },

            getSeasonWeeks = function (callbacks, seasonId) {
                return amplify.request({
                    resourceId: 'seasonweeks',
                    data: { seasonId: seasonId },
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            
            getMonthWeeks = function (callbacks, param) {
                return amplify.request({
                    resourceId: 'monthweeks',
                    data: param,
                    success: callbacks.success,
                    error: callbacks.error
                });
            },

            getWeekAccount = function (callbacks, startDate, endDate) {
                var data = {
                    startDate: startDate,
                    endDate: endDate
                };
                return amplify.request({
                    data: data,
                    resourceId: 'weekaccount',
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

        init();

        return {
            getCurrentWeek: getCurrentWeek,
            getSeasonWeeks: getSeasonWeeks,
            getMonthWeeks: getMonthWeeks,
            getWeekAccount: getWeekAccount
        };
    });