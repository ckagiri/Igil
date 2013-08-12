define('dataservice.seasonteam',
    ['amplify'],
    function (amplify) {
        var init = function () {

            amplify.request.define('allSeasonTeams', 'ajax', {
                url: '/api/seasonteams',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('seasonTeams', 'ajax', {
                url: '/api/seasonteams/{id}',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('addTeams', 'ajax', {
                url: '/api/seasonteams',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('removeTeams', 'ajax', {
                url: '/api/seasonteams/?sId={seasonId}&tId={teamId}',
                dataType: 'json',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8'
            });
        },

        getAllSeasonTeams = function (callbacks) {
            return amplify.request({
                resourceId: 'allSeasonTeams',
                success: callbacks.success,
                error: callbacks.error
            });
        },

        getSeasonTeams = function (callbacks, id) {
            return amplify.request({
                resourceId: 'seasonTeams',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        },

        addTeams = function (callbacks, data) {
            return amplify.request({
                resourceId: 'addTeams',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },

        removeTeams = function (callbacks) {
            return amplify.request({
                resourceId: 'removeTeams',
                data: { seasonId: seasonId },
                success: callbacks.success,
                error: callbacks.error
            });
        };

        init();

        return {
            getAllSeasonTeams: getAllSeasonTeams,
            getSeasonTeams: getSeasonTeams,
            addTeams: addTeams,
            removeTeams: removeTeams
        };
    });