define('dataservice.season', 
    ['amplify'],
    function (amplify) {
        var init = function() {

            amplify.request.define('seasons', 'ajax', {
                url: '/api/seasons',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('season', 'ajax', {
                url: '/api/seasons/{id}',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('seasonAdd', 'ajax', {
                url: '/api/seasons',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('seasonUpdate', 'ajax', {
                url: '/api/seasons',
                dataType: 'json',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('seasonDelete', 'ajax', {
                url: '/api/seasons/{id}',
                dataType: 'json',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8'
            });
        },
            
        getSeasons = function(callbacks) {
            return amplify.request({
                resourceId: 'seasons',
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        getSeason = function(callbacks, id) {
            return amplify.request({
                resourceId: 'season',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        addSeason = function(callbacks, data) {
            return amplify.request({
                resourceId: 'seasonAdd',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        updateSeason = function(callbacks, data) {
            return amplify.request({
                resourceId: 'seasonUpdate',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        deleteSeason = function(callbacks) {
            return amplify.request({
                resourceId: 'seasonDelete',
                data: { seasonId: seasonId },
                success: callbacks.success,
                error: callbacks.error
            });
        };
        
        init();

        return {
            getSeasons: getSeasons,
            getSeason: getSeason,
            addSeason: addSeason,
            deleteSeason: deleteSeason,
            updateSeason: updateSeason
        };
});