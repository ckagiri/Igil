define('dataservice.fixture', 
    ['amplify'],
    function (amplify) {
        var init = function() {

            amplify.request.define('fixtures', 'ajax', {
                url: '/api/fixtures',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('fixture', 'ajax', {
                url: '/api/fixtures/{id}',
                dataType: 'json',
                type: 'GET'
                //cache:
            });

            amplify.request.define('fixtureAdd', 'ajax', {
                url: '/api/fixtures',
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('fixtureUpdate', 'ajax', {
                url: '/api/fixtures',
                dataType: 'json',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8'
            });

            amplify.request.define('fixtureDelete', 'ajax', {
                url: '/api/fixtures/{id}',
                dataType: 'json',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8'
            });
        },
            
        getFixtures = function(callbacks) {
            return amplify.request({
                resourceId: 'fixtures',
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        getFixture = function(callbacks, id) {
            return amplify.request({
                resourceId: 'fixture',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        addFixture = function(callbacks, data) {
            return amplify.request({
                resourceId: 'fixtureAdd',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        updateFixture = function(callbacks, data) {
            return amplify.request({
                resourceId: 'fixtureUpdate',
                data: data,
                success: callbacks.success,
                error: callbacks.error
            });
        },
            
        deleteFixture = function(callbacks) {
            return amplify.request({
                resourceId: 'fixtureDelete',
                data: { id: id },
                success: callbacks.success,
                error: callbacks.error
            });
        };
        
        init();

        return {
            getFixtures: getFixtures,
            getFixture: getFixture,
            addFixture: addFixture,
            deleteFixture: deleteFixture,
            updateFixture: updateFixture
        };
});