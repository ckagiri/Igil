define('dataservice.league', 
    ['amplify'],
    function (amplify) {
        var init = function() {

            amplify.request.define('leagues', 'ajax', {
                url: '/api/leagues',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('league', 'ajax', {
                url: '/api/leagues/{id}',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('leagueAdd', 'ajax', {
                url: '/api/leagues',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('leagueUpdate', 'ajax', {
                url: '/api/leagues',
                dataType: 'json',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('leagueDelete', 'ajax', {
                url: '/api/leagues/{id}',
                dataType: 'json',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8'
            });
        },
            
        getLeagues = function(callbacks) {
            return amplify.request({
                resourceId: 'leagues',
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        getLeague = function(callbacks, id) {
            return amplify.request({
                resourceId: 'league',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        addLeague = function(callbacks, data) {
            return amplify.request({
                resourceId: 'leagueAdd',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        updateLeague = function(callbacks, data) {
            return amplify.request({
                resourceId: 'leagueUpdate',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        deleteLeague = function(callbacks) {
            return amplify.request({
                resourceId: 'leagueDelete',
                data: { leagueId: leagueId },
                success: callbacks.success,
                error: callbacks.error
            });
        };

        init();

        return {
            getLeagues: getLeagues,
            getLeague: getLeague,
            addLeague: addLeague,
            deleteLeague: deleteLeague,
            updateLeague: updateLeague
        };
});