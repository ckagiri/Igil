define('dataservice.team', 
    ['amplify'],
    function (amplify) {
        var init = function() {

            amplify.request.define('teams', 'ajax', {
                url: '/api/teams',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('team', 'ajax', {
                url: '/api/teams/{id}',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('teamAdd', 'ajax', {
                url: '/api/teams',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('teamUpdate', 'ajax', {
                url: '/api/teams',
                dataType: 'json',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('teamDelete', 'ajax', {
                url: '/api/teams/{id}',
                dataType: 'json',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8'
            });
        },
            
        getTeams = function(callbacks) {
            return amplify.request({
                resourceId: 'teams',
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        getTeam = function(callbacks, id) {
            return amplify.request({
                resourceId: 'team',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        addTeam = function(callbacks, data) {
            return amplify.request({
                resourceId: 'teamAdd',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        updateTeam = function(callbacks, data) {
            return amplify.request({
                resourceId: 'teamUpdate',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        deleteTeam = function(callbacks, id) {
            return amplify.request({
                resourceId: 'teamDelete',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        };

        init();

        return {
            getTeams: getTeams,
            getTeam: getTeam,
            addTeam: addTeam,
            deleteTeam: deleteTeam,
            updateTeam: updateTeam
        };
});