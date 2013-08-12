define('binder',
    ['jquery', 'ko', 'config', 'vm'],
    function ($, ko, config, vm) {
        var
            ids = config.viewIds,

            bind = function () {
                ko.applyBindings(vm.shell, getView(ids.shellTop));
                ko.applyBindings(vm.fixtures, getView(ids.fixtures));
                ko.applyBindings(vm.bets, getView(ids.bets));
                ko.applyBindings(vm.leaderboards, getView(ids.leaderboards));
            },
            
            getView = function (viewName) {
                return $(viewName).get(0);
            };
           
        return {
            bind: bind
        };
    });