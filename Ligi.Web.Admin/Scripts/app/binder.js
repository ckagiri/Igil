define('binder',
    ['jquery', 'ko', 'config', 'vm'],
    function ($, ko, config, vm) {
        var
            ids = config.viewIds,

            bind = function () {
                ko.applyBindings(vm.shell, getView(ids.shellTop));
                ko.applyBindings(vm.leagues, getView(ids.leagues));
                ko.applyBindings(vm.teams, getView(ids.teams));
                ko.applyBindings(vm.team, getView(ids.team));
                ko.applyBindings(vm.teamadd, getView(ids.teamadd));
                ko.applyBindings(vm.fixtures, getView(ids.fixtures));
                ko.applyBindings(vm.fixture, getView(ids.fixture));
                ko.applyBindings(vm.fixtureadd, getView(ids.fixtureadd));
                ko.applyBindings(vm.odds, getView(ids.odds));
                ko.applyBindings(vm.matchodds, getView(ids.matchodds));
                ko.applyBindings(vm.results, getView(ids.results));
                ko.applyBindings(vm.result, getView(ids.result));
            },
            
            getView = function (viewName) {
                return $(viewName).get(0);
            };
            
        return {
            bind: bind
        };
    });